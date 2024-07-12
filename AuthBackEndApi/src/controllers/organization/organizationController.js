
 class OrganizationController{
  constructor(organizationService)
  {
    this.organizationService = organizationService;
  }
  // create organization

  async createOrganization(req, res) {
    const { name, address } = req.body;

    try {
      const result = await this.organizationService.createOrganization(
        name,
        address
      );
      res.status(201).json({
        message: "Created Organization Successfully",
        organizationId: result.organizationId,
      });
    } catch (error) {
      console.error("Error in createOrganizationController: ", error);
      if (error.message === "Organization Already Exist!") {
        return res.status(409).json({ message: "Organization already exists" });
      } else if (error.message === "All Fields are Required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // delete organization

  async deleteOrganization(req, res) {
    const { id } = req.params;

    try {
      await this.organizationService.deleteOrganizationById(id);
      res.status(200).json({ message: "Organization deleted successfully" });
    } catch (error) {
      console.error("Error in deleteOrganizationController: ", error);
      if (error.message === "Organization not found") {
        return res.status(404).json({ message: "Organization not found" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  // update organization
  
  async updateOrganization(req, res) {
    const { id } = req.params;
    const { name, address } = req.body;

    try {
      const result = await this.organizationService.updateOrganizationById(
        id,
        name,
        address
      );
      res.status(200).json({
        message: "Updated Organization Successfully",
        organizationId: result.organizationId,
      });
    } catch (error) {
      console.error("Error in updateOrganizationController: ", error);
      if (error.message === "Organization not found") {
        return res.status(404).json({ message: "Organization not found" });
      } else if (error.message === "All Fields are Required") {
        return res.status(400).json({ message: "All fields are required" });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
}

module.exports = OrganizationController;
