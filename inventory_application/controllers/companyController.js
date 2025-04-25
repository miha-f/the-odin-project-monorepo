const asyncHandler = require("express-async-handler");
const { Company: CompanyModel } = require("../models/models.js");
const { body, validationResult } = require("express-validator");

const alphaNumErr = "must only contain letters or numbers."
const notEmptyErr = "must not be empty."

const validateForm = [
    body("companyName").trim()
        .notEmpty().withMessage(`Company name ${notEmptyErr}`)
        .isAlphanumeric().withMessage(`Company name ${alphaNumErr}`),
];

const Company = () => {

    const getAll = asyncHandler(async (req, res) => {
        const ITEMS_PER_PAGE = 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const totalItems = (await CompanyModel.getAllCount()).count;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        const companiesDb = await CompanyModel.getAll(ITEMS_PER_PAGE, offset);
        const companies = companiesDb.map(company => ({
            ...company,
            formattedDate: new Date(company.updated_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        }));

        res.render('companies', { companies: companies, page: page, totalPages: totalPages });
    });

    const getById = asyncHandler(async (req, res) => {
        const { companyId } = req.params;
        const companyDb = await CompanyModel.findById(companyId);
        if (!companyDb) {
            throw new NotFoundError("Company not found");
        }
        const company = {
            ...companyDb,
            updatedAtFormatted: new Date(companyDb.updated_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            createdAtFormatted: new Date(companyDb.created_at).toLocaleDateString('en-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        };

        res.render("company", { company: company });
    });

    const createForm = asyncHandler(async (req, res) => {
        res.render('companiesNew', { formData: {}, formErrors: {} });
    });

    const create = [
        validateForm,
        asyncHandler(async (req, res) => {
            const { companyName } = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const formData = {
                    companyName: companyName,
                };
                const formErrors = {};
                errors.errors.forEach(err => {
                    if (!formErrors[err.path])
                        formErrors[err.path] = [];
                    formErrors[err.path].push(err.msg);
                });
                res.render('companiesNew', { formData: formData, formErrors: formErrors });
                return;
            }

            const company = await CompanyModel.create(companyName);
            if (!company) {
                throw new DbError("Couldn't create company");
            }

            res.redirect(`companies/${company.id}`);
        })];


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

    return { getAll, getById, createForm, create, update, remove };
};

module.exports = Company();
