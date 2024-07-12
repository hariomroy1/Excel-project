class RoleService {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async createRole(name, description) {
    try {
      if (!name || !description) {
        throw new Error("All Fields are Required");
      }

      const existingRole = await this.roleRepository.findOneByName(name);

      if (existingRole) {
        throw new Error("Role Already Exists!");
      }

      const newRole = await this.roleRepository.create(name, description);

      return { roleId: newRole.id };
    } catch (error) {
      console.error("Error in RoleService:", error);
      throw error;
    }
  }
}

module.exports = RoleService;
