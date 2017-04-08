/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('waTest', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    sex: {
      type: DataTypes.ENUM('男','女'),
      allowNull: true,
      field: 'sex'
    },
    userCountry: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'user_country'
    }
  }, {
    tableName: 'wa_test'
  });
};
