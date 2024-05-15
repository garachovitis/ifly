exports.Task = function (id, taskName, status = 0, createdAt = '', userId) {
    this.id = id
    this.task = taskName
    this.status = status
    this.createdAt = createdAt
    this.userId = userId
}

