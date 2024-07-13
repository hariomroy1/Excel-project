const { User } = require("../../../DataLayer/models");
const {userRoles} = require("../../../DataLayer/models");
const {Role} = require("../../../DataLayer/models")

class UserRepository  {
  //create user 
  async createUser(userData) {
    return User.create(userData);
  }
// find user by email
  async findUserByEmail(email) {
    return User.findOne({ where: { email } });
  }

  //find user by id
  async findUserById(id) {
    return User.findByPk(id);
  }

  // below  functions are only used for finding roles 
 async findRoleById(id)
 {
  const userRole = await userRoles.findByPk(id);
  const RoleId = await Role.findByPk(userRole.roleId); 
  return RoleId.name;
 }

 //find user id by email
 async findUserIdByEmail(email)
 {
  const user = await User.findOne({ where: { email } });
  return user.id;
 }

}

module.exports = UserRepository;
