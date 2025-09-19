// Simple in-memory storage for development when MongoDB is not available
class MemoryStorage {
  constructor() {
    this.data = {
      users: [],
      orders: [],
      orderStatuses: [],
      webhookLogs: []
    }
  }

  // User operations
  async createUser(userData) {
    const user = {
      _id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function(candidatePassword) {
        const bcrypt = require('bcryptjs')
        return bcrypt.compare(candidatePassword, this.password)
      }
    }
    this.data.users.push(user)
    return user
  }

  async findUser(query) {
    const user = this.data.users.find(user => 
      Object.keys(query).every(key => user[key] === query[key])
    )
    if (user && !user.comparePassword) {
      user.comparePassword = async function(candidatePassword) {
        const bcrypt = require('bcryptjs')
        return bcrypt.compare(candidatePassword, this.password)
      }
    }
    return user
  }

  // Order operations
  async createOrder(orderData) {
    const order = {
      _id: this.generateId(),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.data.orders.push(order)
    return order
  }

  async findOrder(query) {
    return this.data.orders.find(order => 
      Object.keys(query).every(key => order[key] === query[key])
    )
  }

  async findOrders(query = {}) {
    return this.data.orders.filter(order => 
      Object.keys(query).every(key => order[key] === query[key])
    )
  }

  // OrderStatus operations
  async createOrderStatus(statusData) {
    const status = {
      _id: this.generateId(),
      ...statusData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.data.orderStatuses.push(status)
    return status
  }

  async findOrderStatus(query) {
    return this.data.orderStatuses.find(status => 
      Object.keys(query).every(key => status[key] === query[key])
    )
  }

  async findOrderStatuses(query = {}) {
    return this.data.orderStatuses.filter(status => 
      Object.keys(query).every(key => status[key] === query[key])
    )
  }

  async updateOrderStatus(query, updateData) {
    const index = this.data.orderStatuses.findIndex(status => 
      Object.keys(query).every(key => status[key] === query[key])
    )
    if (index !== -1) {
      this.data.orderStatuses[index] = {
        ...this.data.orderStatuses[index],
        ...updateData,
        updatedAt: new Date()
      }
      return this.data.orderStatuses[index]
    }
    return null
  }

  // WebhookLog operations
  async createWebhookLog(logData) {
    const log = {
      _id: this.generateId(),
      ...logData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.data.webhookLogs.push(log)
    return log
  }

  // Utility
  generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  // Count operations
  async countDocuments(collection, query = {}) {
    const data = this.data[collection] || []
    return data.filter(item => 
      Object.keys(query).every(key => item[key] === query[key])
    ).length
  }

  // Add missing methods for Order model
  async findOrders(query = {}) {
    return this.data.orders.filter(order => 
      Object.keys(query).every(key => order[key] === query[key])
    )
  }

  // Add missing methods for OrderStatus model
  async findOrderStatuses(query = {}) {
    return this.data.orderStatuses.filter(status => 
      Object.keys(query).every(key => status[key] === query[key])
    )
  }
}

module.exports = new MemoryStorage()
