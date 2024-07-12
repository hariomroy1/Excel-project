const { Organizations } = require("../../models");

class OrganizationRepository  {
  async findOneByNameAndAddress(name, address) {
    return Organizations.findOne({ where: { name, address } });
  }

  async create(name, address) {
    return Organizations.create({ name, address });
  }

  async findById(id) {
    return Organizations.findByPk(id);
  }
  async delete(org) {
    return org.destroy();
  }

  async update(org) {
    return org.save();
  }
}

module.exports =  OrganizationRepository;
