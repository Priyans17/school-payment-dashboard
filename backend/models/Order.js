const mongoose = require("mongoose")
const memoryStorage = require("../memory-storage")

// Check if mongoose is connected
const isConnected = mongoose.connection.readyState === 1

let Order

if (isConnected) {
  const orderSchema = new mongoose.Schema(
    {
      school_id: {
        type: String,
        required: true,
      },
      trustee_id: {
        type: String,
        required: true,
      },
      student_info: {
        name: {
          type: String,
          required: true,
        },
        id: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
      },
      gateway_name: {
        type: String,
        required: true,
      },
      custom_order_id: {
        type: String,
        unique: true,
        required: true,
      },
      order_amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        default: "pending_approval",
        enum: ["pending_approval", "approved", "rejected", "pending", "success", "failed"],
      },
      created_by: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    },
  )

  Order = mongoose.model("Order", orderSchema)
} else {
  // Fallback to memory storage
  Order = class {
    constructor(orderData) {
      Object.assign(this, orderData)
    }

    async save() {
      return memoryStorage.createOrder(this)
    }

    static async findOne(query) {
      return memoryStorage.findOrder(query)
    }

    static async find(query = {}) {
      return memoryStorage.findOrders(query)
    }

    static async aggregate(pipeline) {
      // Simple aggregation for memory storage
      const orders = await memoryStorage.findOrders()
      
      // Basic pipeline processing for memory storage
      let result = orders
      
      // Handle $match stage
      const matchStage = pipeline.find(stage => stage.$match)
      if (matchStage) {
        result = result.filter(order => 
          Object.keys(matchStage.$match).every(key => order[key] === matchStage.$match[key])
        )
      }
      
      // Handle $lookup stage (simplified)
      const lookupStage = pipeline.find(stage => stage.$lookup)
      if (lookupStage) {
        const orderStatuses = await memoryStorage.findOrderStatuses()
        result = result.map(order => {
          const status = orderStatuses.find(s => s.collect_id === order._id)
          return {
            ...order,
            orderStatus: status ? [status] : []
          }
        })
      }
      
      // Handle $unwind stage
      const unwindStage = pipeline.find(stage => stage.$unwind)
      if (unwindStage) {
        result = result.flatMap(order => {
          if (order.orderStatus && order.orderStatus.length > 0) {
            return order.orderStatus.map(status => ({ ...order, orderStatus: status }))
          } else {
            return [{ ...order, orderStatus: null }]
          }
        })
      }
      
      // Handle $project stage
      const projectStage = pipeline.find(stage => stage.$project)
      if (projectStage) {
        result = result.map(order => {
          const projected = {}
          Object.keys(projectStage.$project).forEach(key => {
            if (projectStage.$project[key] === 1) {
              projected[key] = order[key]
            } else if (typeof projectStage.$project[key] === 'string' && projectStage.$project[key].startsWith('$')) {
              const fieldPath = projectStage.$project[key].substring(1)
              const parts = fieldPath.split('.')
              let value = order
              for (const part of parts) {
                value = value?.[part]
              }
              projected[key] = value
            }
          })
          return projected
        })
      }
      
      // Handle $sort stage
      const sortStage = pipeline.find(stage => stage.$sort)
      if (sortStage) {
        const sortKey = Object.keys(sortStage.$sort)[0]
        const sortOrder = sortStage.$sort[sortKey]
        result.sort((a, b) => {
          const aVal = a[sortKey]
          const bVal = b[sortKey]
          if (sortOrder === -1) {
            return bVal > aVal ? 1 : -1
          } else {
            return aVal > bVal ? 1 : -1
          }
        })
      }
      
      // Handle $skip stage
      const skipStage = pipeline.find(stage => stage.$skip)
      if (skipStage) {
        result = result.slice(skipStage.$skip)
      }
      
      // Handle $limit stage
      const limitStage = pipeline.find(stage => stage.$limit)
      if (limitStage) {
        result = result.slice(0, limitStage.$limit)
      }
      
      return result
    }

    static async countDocuments(query = {}) {
      return memoryStorage.countDocuments('orders', query)
    }
  }
}

module.exports = Order
