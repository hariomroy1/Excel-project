const { Role, userRoles,User } = require('../../../DataLayer/models');

class RolesRepository {
  async findRoleById(id) {
    return Role.findByPk(id);
  }

  async findUserRole(userId, roleId) {
    return userRoles.findOne({ where: { userId, roleId } });
  }

  async createUserRole(userId, roleId) {
    return userRoles.create({ userId, roleId });
  }
  async findUserById(userId)
  {
    const user = await User.findOne({ where: { id: userId } });

    return user;
  }
}

module.exports = RolesRepository;
