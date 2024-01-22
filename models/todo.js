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
    }
    static async AllTodos() {
      /* const dueYes = this.overdue();
      const dueToday = this.dueToday();
      const dueLater = this.dueLater();
      return {
        dueYes : dueYes.length,
        dueToday : dueToday.length,
        dueLater : dueLater.length
      } */
      const todos = await Todo.findAll();
      return todos
    }
    static addTodo({title,dueDate}) {
      return this.create({title : title ,dueDate : dueDate,completed:false})
    }
    markAsCompleted() {
      return this.update({completed : true})
    }
    static async overdue() {
      const d = new Date();
      const Todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: d,
          },
        },
      });
      return Todos;
    }
    static async dueToday() {
      const d = new Date();
      const Todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: d,
          },
        },
      });
      return Todos;
    }
    static async dueLater() {
      const d = new Date();
      const Todos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: d,
          },
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
