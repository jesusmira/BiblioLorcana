"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var pg_1 = __importDefault(require("pg"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var connectionString = process.env.DATABASE_URL || "postgresql://biblioLor_user:biblioLor_pass@localhost:5432/biblioLor?schema=public";
var pool = new pg_1.default.Pool({ connectionString: connectionString });
var adapter = new adapter_pg_1.PrismaPg(pool);
var prisma = new client_1.PrismaClient({ adapter: adapter });
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, fileContent, data, importedCount, _i, data_1, set, i, card, uniqueKey, existingCard, strength, willpower, lore, cost, ink, abilitiesText;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    filePath = path.join(__dirname, "locarna_cards.json");
                    fileContent = fs.readFileSync(filePath, "utf-8");
                    data = JSON.parse(fileContent);
                    importedCount = 0;
                    _i = 0, data_1 = data;
                    _b.label = 1;
                case 1:
                    if (!(_i < data_1.length)) return [3 /*break*/, 7];
                    set = data_1[_i];
                    console.log("Importing set: ".concat(set.set_name, " (").concat(set.cards.length, " cards)"));
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < set.cards.length)) return [3 /*break*/, 6];
                    card = set.cards[i];
                    uniqueKey = "".concat(card.collector_number, "_").concat(card.card_name);
                    return [4 /*yield*/, prisma.card.findFirst({
                            where: { collectorNumber: card.collector_number },
                        })];
                case 3:
                    existingCard = _b.sent();
                    if (existingCard && existingCard.name === card.card_name) {
                        console.log("  - ".concat(card.card_name, " already exists, skipping"));
                        return [3 /*break*/, 5];
                    }
                    strength = typeof card.strength === "string" ? (card.strength === "" ? null : parseInt(card.strength)) : card.strength;
                    willpower = typeof card.willpower === "string" ? (card.willpower === "" ? null : parseInt(card.willpower)) : card.willpower;
                    lore = typeof card.lore === "string" ? (card.lore === "" ? null : parseInt(card.lore)) : card.lore;
                    cost = typeof card.cost === "string" ? (card.cost === "" ? null : parseInt(card.cost)) : card.cost;
                    ink = Array.isArray(card.ink) ? card.ink[0] : card.ink;
                    abilitiesText = ((_a = card.abilities) === null || _a === void 0 ? void 0 : _a.join("\n")) || "";
                    return [4 /*yield*/, prisma.card.create({
                            data: {
                                name: card.card_name,
                                text: abilitiesText,
                                flavorText: card.flavor_text,
                                ink: ink,
                                cost: cost,
                                rarity: card.rarity,
                                type: [card.type],
                                strength: strength,
                                willpower: willpower,
                                lore: lore,
                                collectorNumber: card.collector_number || null,
                                classifications: card.keywords || [],
                                imageUrl: card.image_url || null,
                                promoSet: card.promo_set || null,
                                nonPromoSet: card.non_propmo_set || null,
                            },
                        })];
                case 4:
                    _b.sent();
                    if (card.promo_set || card.non_propmo_set) {
                        console.log("    promo: ".concat(card.promo_set, ", non_promo: ").concat(card.non_propmo_set));
                    }
                    importedCount++;
                    console.log("  + ".concat(card.card_name));
                    _b.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 2];
                case 6:
                    _i++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("\nTotal imported: ".concat(importedCount, " cards"));
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
