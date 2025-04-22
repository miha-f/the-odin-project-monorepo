const asyncHandler = require("express-async-handler");
const { Company: CompanyModel } = require("../models/models.js");

const Company = () => {

    const getAll = asyncHandler(async (req, res) => {
        const companies = await CompanyModel.getAll();
        res.send(companies);
    });

    const getById = asyncHandler(async (req, res) => {
        const { companyId } = req.params;
        const company = await CompanyModel.findById(companyId);
        res.send(company);
    });

    const create = asyncHandler(async (req, res) => {
        const { companyId } = req.params;
        const company = await CompanyModel.create(companyId);
        res.send(company);
    });

    const update = asyncHandler(async (req, res) => {
        const { companyId } = req.params;
        const company = await CompanyModel.update(companyId);
        res.send(company);
    });

    const remove = asyncHandler(async (req, res) => {
        const { companyId } = req.params;
        const company = await CompanyModel.delete(companyId);
        res.send(company);
    });

    return { getAll, getById, create, update, remove };
};

module.exports = Company();
