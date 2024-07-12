class RolesService {
    constructor(rolesRepository) {
      this.rolesRepository = rolesRepository;
    }
  
    async createUserRole(userId, roleId) {
      const user = await this.rolesRepository.findUserById(userId);
      if (!user) {
        throw new Error('User Not Found');
      }
  
      const role = await this.rolesRepository.findRoleById(roleId);
      if (!role) {
        throw new Error('Role Not Found');
      }
  
      const existingUserRole = await this.rolesRepository.findUserRole(userId, roleId);
      if (existingUserRole) {
        throw new Error('UserRole Already Exists!');
      }
  
      const newUserRole = await this.rolesRepository.createUserRole(userId, roleId);
      return { userRoleId: newUserRole.id };
    }
  }
  
  module.exports = RolesService;
  