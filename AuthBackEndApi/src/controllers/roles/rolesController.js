class RoleController {
  constructor(roleService) {
    this.roleService = roleService;
  }

  async createRole(req, res) {
    const { name, description } = req.body;

    try {
      const result = await this.roleService.createRole(name, description);
      res.status(201).json({
        message: "Created Role Successfully",
        roleId: result.roleId,
      });
    } catch (error) {
      console.error("Error in createRoleController: ", error);
      if (error.message === "Role Already Exists!") {
        return res.status(409).json({ message: "Role already exists" });
      } else if (error.message === "All Fields are Required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = RoleController;
