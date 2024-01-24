'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User,{
        foreignKey:'userId'
      })
    }
    static async AllTodos(userId) {
      const dueYes = await this.overdue(userId);
      const dueToday = await this.dueToday(userId);
      const dueLater = await this.dueLater(userId);
      return {
        dueYes : dueYes,
        dueToday : dueToday,
        dueLater : dueLater
      }
    }
    static addTodo({title,dueDate,userId}) {
      return this.create({title : title ,dueDate : dueDate,completed:false,userId})
    }
    markAsCompleted() {
      const updatedStatus = !this.completed;
      return this.update({ completed: updatedStatus }).then(updatedTodo => updatedTodo.toJSON());
  }  
    static async overdue(userId) {
      const d = new Date();
      const Todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: d,
          },
          userId
        },
      });
      return Todos;
    }
    static async dueToday(userId) {
      const d = new Date();
      const Todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: d,
          },
          userId
        },
      });
      return Todos;
    }
    static async dueLater(userId) {
      const d = new Date();
      const Todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: d,
          },
          userId
        },
      });
      return Todos;
    }
   /*  static async markAsComplete(id) {
      const item = await Todo.findByPk(id);

      item.completed = true;
      await item.save();
    } */
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
