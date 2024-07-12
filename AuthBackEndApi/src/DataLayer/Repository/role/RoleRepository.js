const Role = require("../../models/Role");

class RoleRepository {
  async findOneByName(name) {
    return await Role.findOne({
      where: { name },
    });
  }

  async create(name, description) {
    return await Role.create({
      name,
      description,
    });
  }
  async findByPk(id) {
    return await Role.findByPk(id);
  }
}

module.exports = RoleRepository;
