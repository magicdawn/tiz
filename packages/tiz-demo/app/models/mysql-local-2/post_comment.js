/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postComment', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    postId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'post_id'
    },
    userId: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'user_id'
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'user_name'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'content'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at'
    }
  }, {
    tableName: 'post_comment'
  });
};
