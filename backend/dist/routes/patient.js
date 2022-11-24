"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
var celebrate_1 = require("celebrate");
var prisma_client_1 = __importDefault(require("../prisma-client"));
var client_1 = require("@prisma/client");
var runtime_1 = require("@prisma/client/runtime");
var app_1 = require("../app");
var express_1 = __importDefault(require("express"));
var luxon_1 = require("luxon");
var patientRouter = express_1.default.Router();
patientRouter.get('/getDoctors', (0, celebrate_1.celebrate)((_a = {},
    _a[celebrate_1.Segments.QUERY] = {
        requestedStatus: celebrate_1.Joi.string().required(),
        requesterRole: celebrate_1.Joi.string().required()
    },
    _a)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, requesterRole, requestedStatus, doctors;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.currentUser;
                _a = req.query, requesterRole = _a.requesterRole, requestedStatus = _a.requestedStatus;
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findMany({
                        where: {
                            patientUid: user.uid,
                            status: requestedStatus,
                            requester: requesterRole
                        },
                        include: {
                            doctor: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    })];
            case 1:
                doctors = _b.sent();
                res.json(doctors);
                return [2 /*return*/];
        }
    });
}); });
patientRouter.get('/searchDoctors', (0, celebrate_1.celebrate)((_b = {},
    _b[celebrate_1.Segments.QUERY] = {
        query: celebrate_1.Joi.string().required()
    },
    _b)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, query, doctorList, result, flattened, nameList, nameListIds, merged;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                query = req.query.query;
                return [4 /*yield*/, prisma_client_1.default.doctor.findMany({
                        where: {
                            OR: [
                                { user: { firstName: { contains: query, mode: 'insensitive' } } },
                                { user: { lastName: { contains: query, mode: 'insensitive' } } },
                                { user: { email: { contains: query, mode: 'insensitive' } } },
                                { medicalPractice: { contains: query, mode: 'insensitive' } }
                            ],
                            //Comment this line out for testing searching
                            verified: true
                        },
                        select: {
                            uid: true,
                            medicalPractice: true,
                            user: true,
                            patients: {
                                where: {
                                    patientUid: user.uid
                                }
                            }
                        },
                    })
                    //This next section searches for full name by concatenating firstName and lastName
                    //this query raw unsafe and the next prisma.findMany could be combined into a singular custom SQL for better perf
                ];
            case 1:
                doctorList = _a.sent();
                return [4 /*yield*/, prisma_client_1.default.$queryRawUnsafe("SELECT d.uid FROM \"doctor\" d INNER JOIN \"user\" u on d.uid = u.uid WHERE CONCAT(u.\"firstName\",' ',u.\"lastName\") ILIKE CONCAT('%',$1::text,'%');", query)];
            case 2:
                result = _a.sent();
                flattened = result.map(function (v) { return v.uid; });
                return [4 /*yield*/, prisma_client_1.default.doctor.findMany({
                        where: {
                            uid: { in: flattened },
                            verified: true
                        },
                        select: {
                            uid: true,
                            medicalPractice: true,
                            user: true,
                            patients: {
                                where: {
                                    patientUid: user.uid
                                }
                            }
                        },
                    })];
            case 3:
                nameList = _a.sent();
                nameListIds = new Set(nameList.map(function (d) { return d.uid; }));
                merged = __spreadArray(__spreadArray([], nameList, true), doctorList.filter(function (d) { return !nameListIds.has(d.uid); }), true);
                return [2 /*return*/, res.json(merged)];
        }
    });
}); });
patientRouter.post('/inviteDoctor', (0, celebrate_1.celebrate)((_c = {},
    _c[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        doctorUid: celebrate_1.Joi.string().required()
    }),
    _c)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorUid, roles, validRole, currentRelationship, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                doctorUid = req.body.doctorUid;
                return [4 /*yield*/, prisma_client_1.default.userRoles.findMany({
                        where: {
                            uid: doctorUid
                        }
                    })];
            case 1:
                roles = _a.sent();
                validRole = roles.filter(function (item) {
                    return item.role === "DOCTOR";
                });
                if (validRole.length == 0) {
                    console.log("Provided uid is not a doctor: " + doctorUid);
                    return [2 /*return*/, res.status(400).send('Something went wrong. Please refresh the page and try again.')];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid
                            }
                        }
                    })];
            case 2:
                currentRelationship = _a.sent();
                if ((currentRelationship === null || currentRelationship === void 0 ? void 0 : currentRelationship.status) == client_1.RelationshipStatus.ACCEPTED) {
                    return [2 /*return*/, res.status(400).send('This doctor already has access to your data.')];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.upsert({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid
                            }
                        },
                        update: {
                            requester: client_1.Role.PATIENT,
                            requestedTimestamp: new Date(),
                            status: client_1.RelationshipStatus.REQUESTED
                        },
                        create: {
                            doctorUid: doctorUid,
                            patientUid: user.uid,
                            requester: client_1.Role.PATIENT,
                            status: client_1.RelationshipStatus.REQUESTED
                        }
                    })];
            case 3:
                result = _a.sent();
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
patientRouter.get('/getDoctorRelationship', (0, celebrate_1.celebrate)((_d = {},
    _d[celebrate_1.Segments.QUERY] = {
        doctorUid: celebrate_1.Joi.string().required()
    },
    _d)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorUid, currentRelationship;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                doctorUid = req.query.doctorUid;
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid
                            }
                        }
                    })];
            case 1:
                currentRelationship = _a.sent();
                res.json(currentRelationship);
                return [2 /*return*/];
        }
    });
}); });
patientRouter.get('/getAllDoctorRelationships', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                return [4 /*yield*/, prisma_client_1.default.doctor.findMany({
                        where: {
                            patients: {
                                some: {
                                    patientUid: user.uid
                                }
                            }
                        },
                        select: {
                            medicalPractice: true,
                            user: true,
                            patients: {
                                where: {
                                    patientUid: user.uid
                                }
                            }
                        }
                    })];
            case 1:
                doctorList = _a.sent();
                res.json(doctorList);
                return [2 /*return*/];
        }
    });
}); });
patientRouter.post('/deleteDoctor', (0, celebrate_1.celebrate)((_e = {},
    _e[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        doctorUid: celebrate_1.Joi.string().required()
    }),
    _e)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorUid, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                doctorUid = req.body.doctorUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.update({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid
                            }
                        },
                        data: {
                            deleter: client_1.Role.PATIENT,
                            deleteTimestamp: new Date(),
                            status: client_1.RelationshipStatus.DELETED
                        }
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                if (e_1 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_1.code);
                    // if (e.code==='P2025') {
                    //     return res.status(400).send("Could not find pre-existing connection with doctor.")
                    // }
                }
                else if (e_1 instanceof Error) {
                    console.log(e_1.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 4: return [2 /*return*/, res.status(200).send()];
        }
    });
}); });
patientRouter.post('/acceptDoctor', (0, celebrate_1.celebrate)((_f = {},
    _f[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        doctorUid: celebrate_1.Joi.string().required()
    }),
    _f)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorUid, record, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                doctorUid = req.body.doctorUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid,
                            }
                        }
                    })];
            case 2:
                record = _a.sent();
                if (record === null || (record.status != client_1.RelationshipStatus.REQUESTED && record.requester != client_1.Role.DOCTOR)) {
                    return [2 /*return*/, res.status(400).send("Could not find pre-existing request")];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.update({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid,
                            }
                        },
                        data: {
                            acceptedTimestamp: new Date(),
                            status: client_1.RelationshipStatus.ACCEPTED
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                if (e_2 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_2.code);
                    if (e_2.code === 'P2025') {
                        return [2 /*return*/, res.status(400).send("Could not find pre-existing connection with doctor.")];
                    }
                }
                else if (e_2 instanceof Error) {
                    console.log(e_2.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5: return [2 /*return*/, res.status(200).send()];
        }
    });
}); });
patientRouter.post('/rejectDoctor', (0, celebrate_1.celebrate)((_g = {},
    _g[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        doctorUid: celebrate_1.Joi.string().required()
    }),
    _g)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorUid, record, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                doctorUid = req.body.doctorUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid,
                            }
                        }
                    })];
            case 2:
                record = _a.sent();
                if (record === null || (record.status != client_1.RelationshipStatus.REQUESTED && record.requester != client_1.Role.DOCTOR)) {
                    return [2 /*return*/, res.status(400).send("Could not find pre-existing request")];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.update({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid,
                            }
                        },
                        data: {
                            rejectedTimestamp: new Date(),
                            status: client_1.RelationshipStatus.REJECTED
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                if (e_3 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_3.code);
                    if (e_3.code === 'P2025') {
                        return [2 /*return*/, res.status(400).send("Could not find valid pre-existing connection with doctor.")];
                    }
                }
                else if (e_3 instanceof Error) {
                    console.log(e_3.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5:
                res.status(200).send();
                return [2 /*return*/];
        }
    });
}); });
patientRouter.post('/cancelDoctorInvitation', (0, celebrate_1.celebrate)((_h = {},
    _h[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        doctorUid: celebrate_1.Joi.string().required()
    }),
    _h)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, doctorUid, record, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                doctorUid = req.body.doctorUid;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.findUnique({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid,
                            }
                        }
                    })];
            case 2:
                record = _a.sent();
                if (record === null || (record.status != client_1.RelationshipStatus.REQUESTED && record.requester != client_1.Role.PATIENT)) {
                    return [2 /*return*/, res.status(400).send("Could not find valid pre-existing request")];
                }
                return [4 /*yield*/, prisma_client_1.default.doctorOnPatient.delete({
                        where: {
                            doctorUid_patientUid: {
                                doctorUid: doctorUid,
                                patientUid: user.uid,
                            }
                        }
                    })];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                if (e_4 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_4.code);
                    if (e_4.code === 'P2025') {
                        return [2 /*return*/, res.status(400).send("Could not find pre-existing connection with doctor.")];
                    }
                }
                else if (e_4 instanceof Error) {
                    console.log(e_4.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 5: return [2 /*return*/, res.status(200).send()];
        }
    });
}); });
patientRouter.post('/verifyPatient', (0, celebrate_1.celebrate)((_j = {},
    _j[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        firstName: celebrate_1.Joi.string().allow(""),
        lastName: celebrate_1.Joi.string().allow(""),
        sex: celebrate_1.Joi.string().required(),
        birthDate: celebrate_1.Joi.string().required(),
        avatarImageUrl: celebrate_1.Joi.string().allow(""),
    }),
    _j)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, birthDate, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                console.log("Verifying patient");
                birthDate = luxon_1.DateTime.fromSQL(req.body.birthDate);
                if (!birthDate.isValid) {
                    return [2 /*return*/, res.status(400).send("Invalid date")];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma_client_1.default.$transaction([
                        prisma_client_1.default.user.update({
                            where: {
                                uid: user.uid
                            },
                            data: {
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                avatarImageUrl: req.body.avatarImageUrl
                            }
                        }),
                        prisma_client_1.default.patient.update({
                            where: {
                                uid: user.uid
                            },
                            data: {
                                birthDate: birthDate.toJSDate(),
                                sex: req.body.sex,
                                verified: true
                            }
                        })
                    ])];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                if (e_5 instanceof runtime_1.PrismaClientKnownRequestError) {
                    console.log("Prisma error code: " + e_5.code);
                    // if (e.code==='P2025') {
                    //     return res.status(400).send("Could not find pre-existing connection with doctor.")
                    // }
                }
                else if (e_5 instanceof Error) {
                    console.log(e_5.message);
                }
                return [2 /*return*/, res.status(500).send("Something went wrong. Please try again.")];
            case 4: return [2 /*return*/, res.status(200).send('Patient verification submitted for ' + user.email)];
        }
    });
}); });
patientRouter.get('/getAllMemos', (0, celebrate_1.celebrate)((_k = {},
    _k[celebrate_1.Segments.QUERY] = {
        pageNum: celebrate_1.Joi.number().integer().required(),
        perPage: celebrate_1.Joi.number().integer().required(),
    },
    _k)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pageNum, perPage, user, results, totalCount;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pageNum = parseInt(req.query.pageNum);
                perPage = parseInt(req.query.perPage);
                user = req.currentUser;
                return [4 /*yield*/, prisma_client_1.default.memo.findMany({
                        skip: (pageNum - 1) * perPage,
                        take: perPage,
                        where: {
                            patientUid: user.uid
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        select: {
                            id: true,
                            doctor: {
                                select: {
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true
                                        }
                                    }
                                }
                            },
                            diagnoses: true,
                            createdAt: true,
                            patientHasAccess: true
                        }
                    })];
            case 1:
                results = _a.sent();
                return [4 /*yield*/, prisma_client_1.default.memo.count({
                        where: {
                            patientUid: user.uid,
                        }
                    })];
            case 2:
                totalCount = _a.sent();
                return [2 /*return*/, res.json({ totalCount: totalCount, results: results })];
        }
    });
}); });
patientRouter.get('/getMemo', (0, celebrate_1.celebrate)((_l = {},
    _l[celebrate_1.Segments.QUERY] = {
        memoId: celebrate_1.Joi.number().required(),
    },
    _l)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, memoId, foundMemo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.currentUser;
                memoId = parseInt(req.query.memoId);
                return [4 /*yield*/, prisma_client_1.default.memo.findUnique({
                        where: {
                            id: memoId
                        },
                        include: {
                            doctor: {
                                select: {
                                    user: true
                                }
                            },
                            patient: true,
                            diagnoses: true,
                            prescriptions: true
                        }
                    })];
            case 1:
                foundMemo = _a.sent();
                if (foundMemo === null) {
                    return [2 /*return*/, res.status(400).send("Memo id not found.")];
                }
                if (foundMemo.patient.uid !== user.uid) {
                    return [2 /*return*/, res.status(401).send("You do not have access to this memo.")];
                }
                if (!foundMemo.patientHasAccess) {
                    return [2 /*return*/, res.status(401).send("You have not purchased this memo and do not have access to it.")];
                }
                return [2 /*return*/, res.json(foundMemo)];
        }
    });
}); });
patientRouter.post('/purchaseMemo', (0, celebrate_1.celebrate)((_m = {},
    _m[celebrate_1.Segments.BODY] = celebrate_1.Joi.object().keys({
        memoId: celebrate_1.Joi.number().required()
    }),
    _m)), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var memoId, domainUrl, user, userRecord, memoRecord, doctorName, formattedDate, customerId, formattedName, createdCustomer, session;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                memoId = req.body.memoId;
                domainUrl = process.env.DOMAIN;
                user = req.currentUser;
                return [4 /*yield*/, prisma_client_1.default.user.findUnique({
                        where: {
                            uid: user.uid
                        }
                    })];
            case 1:
                userRecord = _a.sent();
                if (userRecord === null) {
                    return [2 /*return*/, res.status(400).send("User id not found")];
                }
                return [4 /*yield*/, prisma_client_1.default.memo.findUnique({
                        where: {
                            id: memoId
                        },
                        include: {
                            doctor: {
                                include: {
                                    user: true
                                }
                            }
                        }
                    })];
            case 2:
                memoRecord = _a.sent();
                if (memoRecord === null) {
                    return [2 /*return*/, res.status(400).send("Memo id not found")];
                }
                doctorName = memoRecord.doctor.user.firstName + " " + memoRecord.doctor.user.lastName;
                formattedDate = luxon_1.DateTime.fromJSDate(memoRecord.createdAt).toLocaleString(luxon_1.DateTime.DATETIME_MED);
                customerId = userRecord.stripeCustomerId;
                if (!(customerId === null)) return [3 /*break*/, 5];
                formattedName = "";
                if (!userRecord.firstName && !userRecord.lastName) {
                    formattedName = "";
                }
                else if (!userRecord.firstName && userRecord.lastName) {
                    formattedName = userRecord.lastName;
                }
                else if (!userRecord.lastName && userRecord.firstName) {
                    formattedName = userRecord.firstName;
                }
                else {
                    formattedName = userRecord.firstName + " " + userRecord.lastName;
                }
                return [4 /*yield*/, app_1.stripe.customers.create({
                        email: userRecord.email,
                        name: formattedName
                    })];
            case 3:
                createdCustomer = _a.sent();
                return [4 /*yield*/, prisma_client_1.default.user.update({
                        where: {
                            uid: user.uid
                        },
                        data: {
                            stripeCustomerId: createdCustomer.id
                        }
                    })];
            case 4:
                _a.sent();
                customerId = createdCustomer.id;
                _a.label = 5;
            case 5: return [4 /*yield*/, app_1.stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: "Memo written by ".concat(doctorName, " on ").concat(formattedDate),
                                },
                                unit_amount: 500,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: "".concat(domainUrl, "/patient/memos/").concat(memoId, "?purchased=true"),
                    cancel_url: "".concat(domainUrl, "/patient/memos"),
                    customer: customerId,
                    client_reference_id: memoId
                })];
            case 6:
                session = _a.sent();
                return [2 /*return*/, res.json({ url: session.url })];
        }
    });
}); });
exports.default = patientRouter;
//# sourceMappingURL=patient.js.map