﻿
//#region [ VARIABLES ]

const CSV_STRINGIFY = require('csv-stringify');
const UUID = require('uuid');
const MUSTACHE = require("mustache");
const _ = require('lodash');

const JOB = require('cron').CronJob;

const PATH = require('path');
const FS = require('fs');
const FETCH = require('node-fetch');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const KUE = require('kue');
const QUEUE = KUE.createQueue();

//#endregion

let PAGE_SIZE = 10;
//let TOTAL_PROCESS_ONCE = 20;
let TOTAL_PROCESS_ONCE = require('os').cpus().length;

//#region [ GENERAL ]

function core___general() {
	var max = 100;
	var s = '', t = '';

	s = '\n\nconst NAMES = [];';

	for (var i = 0; i < max; i++)  t += ', DATA_' + i + ' = []';
	if (t[0] == ',') t = t.substr(1);
	s += '\n\nconst ' + t + ';';
	t = '';

	for (var i = 0; i < max; i++)  t += ', BUSY_' + i + ' = false';
	if (t[0] == ',') t = t.substr(1);
	s += '\n\n\let ' + t + ';';
	t = '';

	s += '\n\n';
	t = 'function core___set_busy(index, is_busy){\n';
	t += '\tswitch(index){\n';
	for (var i = 0; i < max; i++)  t += '\t\tcase ' + i + ': BUSY_' + i + ' = is_busy; break;\n';
	t += '\t}\n';
	t += '\n}\n';
	s += t;
	t = '';

	s += '\n\n';
	t = 'function core___check_busy(index){\n';
	t += '\tswitch(index){\n';
	for (var i = 0; i < max; i++)  t += '\t\tcase ' + i + ': return BUSY_' + i + ';\n';
	t += '\t}\n';
	t += '\treturn null;\n';
	t += '\n}\n';
	s += t;
	t = '';


	s += '\n\n';
	t = 'function core___get_data_by_index(index){\n';
	t += '\tswitch(index){\n';
	for (var i = 0; i < max; i++)  t += '\t\tcase ' + i + ': return DATA_' + i + ';\n';
	t += '\t}\n';
	t += '\treturn null;\n';
	t += '\n}\n';
	s += t;
	t = '';

	s += '\n\n';
	t = 'function core___init_queue(){\n';
	for (var i = 0; i < max; i++)  t += '\tQUEUE.process("' + i + '", TOTAL_PROCESS_ONCE, core___process);\n';
	t += '\n}\n';
	s += t;
	t = '';


	s += '\n\ncore___init_queue();';

	//console.log(s + '\n\n');
	FS.writeFileSync('_.js', s);
	console.log('GENERAL -> DONE ...');
};
//core___general();

//#endregion

//#region [ INIT ]

const NAMES = [];

const DATA_0 = [], DATA_1 = [], DATA_2 = [], DATA_3 = [], DATA_4 = [], DATA_5 = [], DATA_6 = [], DATA_7 = [], DATA_8 = [], DATA_9 = [], DATA_10 = [], DATA_11 = [], DATA_12 = [], DATA_13 = [], DATA_14 = [], DATA_15 = [], DATA_16 = [], DATA_17 = [], DATA_18 = [], DATA_19 = [], DATA_20 = [], DATA_21 = [], DATA_22 = [], DATA_23 = [], DATA_24 = [], DATA_25 = [], DATA_26 = [], DATA_27 = [], DATA_28 = [], DATA_29 = [], DATA_30 = [], DATA_31 = [], DATA_32 = [], DATA_33 = [], DATA_34 = [], DATA_35 = [], DATA_36 = [], DATA_37 = [], DATA_38 = [], DATA_39 = [], DATA_40 = [], DATA_41 = [], DATA_42 = [], DATA_43 = [], DATA_44 = [], DATA_45 = [], DATA_46 = [], DATA_47 = [], DATA_48 = [], DATA_49 = [], DATA_50 = [], DATA_51 = [], DATA_52 = [], DATA_53 = [], DATA_54 = [], DATA_55 = [], DATA_56 = [], DATA_57 = [], DATA_58 = [], DATA_59 = [], DATA_60 = [], DATA_61 = [], DATA_62 = [], DATA_63 = [], DATA_64 = [], DATA_65 = [], DATA_66 = [], DATA_67 = [], DATA_68 = [], DATA_69 = [], DATA_70 = [], DATA_71 = [], DATA_72 = [], DATA_73 = [], DATA_74 = [], DATA_75 = [], DATA_76 = [], DATA_77 = [], DATA_78 = [], DATA_79 = [], DATA_80 = [], DATA_81 = [], DATA_82 = [], DATA_83 = [], DATA_84 = [], DATA_85 = [], DATA_86 = [], DATA_87 = [], DATA_88 = [], DATA_89 = [], DATA_90 = [], DATA_91 = [], DATA_92 = [], DATA_93 = [], DATA_94 = [], DATA_95 = [], DATA_96 = [], DATA_97 = [], DATA_98 = [], DATA_99 = [];

let BUSY_0 = false, BUSY_1 = false, BUSY_2 = false, BUSY_3 = false, BUSY_4 = false, BUSY_5 = false, BUSY_6 = false, BUSY_7 = false, BUSY_8 = false, BUSY_9 = false, BUSY_10 = false, BUSY_11 = false, BUSY_12 = false, BUSY_13 = false, BUSY_14 = false, BUSY_15 = false, BUSY_16 = false, BUSY_17 = false, BUSY_18 = false, BUSY_19 = false, BUSY_20 = false, BUSY_21 = false, BUSY_22 = false, BUSY_23 = false, BUSY_24 = false, BUSY_25 = false, BUSY_26 = false, BUSY_27 = false, BUSY_28 = false, BUSY_29 = false, BUSY_30 = false, BUSY_31 = false, BUSY_32 = false, BUSY_33 = false, BUSY_34 = false, BUSY_35 = false, BUSY_36 = false, BUSY_37 = false, BUSY_38 = false, BUSY_39 = false, BUSY_40 = false, BUSY_41 = false, BUSY_42 = false, BUSY_43 = false, BUSY_44 = false, BUSY_45 = false, BUSY_46 = false, BUSY_47 = false, BUSY_48 = false, BUSY_49 = false, BUSY_50 = false, BUSY_51 = false, BUSY_52 = false, BUSY_53 = false, BUSY_54 = false, BUSY_55 = false, BUSY_56 = false, BUSY_57 = false, BUSY_58 = false, BUSY_59 = false, BUSY_60 = false, BUSY_61 = false, BUSY_62 = false, BUSY_63 = false, BUSY_64 = false, BUSY_65 = false, BUSY_66 = false, BUSY_67 = false, BUSY_68 = false, BUSY_69 = false, BUSY_70 = false, BUSY_71 = false, BUSY_72 = false, BUSY_73 = false, BUSY_74 = false, BUSY_75 = false, BUSY_76 = false, BUSY_77 = false, BUSY_78 = false, BUSY_79 = false, BUSY_80 = false, BUSY_81 = false, BUSY_82 = false, BUSY_83 = false, BUSY_84 = false, BUSY_85 = false, BUSY_86 = false, BUSY_87 = false, BUSY_88 = false, BUSY_89 = false, BUSY_90 = false, BUSY_91 = false, BUSY_92 = false, BUSY_93 = false, BUSY_94 = false, BUSY_95 = false, BUSY_96 = false, BUSY_97 = false, BUSY_98 = false, BUSY_99 = false;

function core___set_busy(index, is_busy) {
	switch (index) {
		case 0: BUSY_0 = is_busy; break;
		case 1: BUSY_1 = is_busy; break;
		case 2: BUSY_2 = is_busy; break;
		case 3: BUSY_3 = is_busy; break;
		case 4: BUSY_4 = is_busy; break;
		case 5: BUSY_5 = is_busy; break;
		case 6: BUSY_6 = is_busy; break;
		case 7: BUSY_7 = is_busy; break;
		case 8: BUSY_8 = is_busy; break;
		case 9: BUSY_9 = is_busy; break;
		case 10: BUSY_10 = is_busy; break;
		case 11: BUSY_11 = is_busy; break;
		case 12: BUSY_12 = is_busy; break;
		case 13: BUSY_13 = is_busy; break;
		case 14: BUSY_14 = is_busy; break;
		case 15: BUSY_15 = is_busy; break;
		case 16: BUSY_16 = is_busy; break;
		case 17: BUSY_17 = is_busy; break;
		case 18: BUSY_18 = is_busy; break;
		case 19: BUSY_19 = is_busy; break;
		case 20: BUSY_20 = is_busy; break;
		case 21: BUSY_21 = is_busy; break;
		case 22: BUSY_22 = is_busy; break;
		case 23: BUSY_23 = is_busy; break;
		case 24: BUSY_24 = is_busy; break;
		case 25: BUSY_25 = is_busy; break;
		case 26: BUSY_26 = is_busy; break;
		case 27: BUSY_27 = is_busy; break;
		case 28: BUSY_28 = is_busy; break;
		case 29: BUSY_29 = is_busy; break;
		case 30: BUSY_30 = is_busy; break;
		case 31: BUSY_31 = is_busy; break;
		case 32: BUSY_32 = is_busy; break;
		case 33: BUSY_33 = is_busy; break;
		case 34: BUSY_34 = is_busy; break;
		case 35: BUSY_35 = is_busy; break;
		case 36: BUSY_36 = is_busy; break;
		case 37: BUSY_37 = is_busy; break;
		case 38: BUSY_38 = is_busy; break;
		case 39: BUSY_39 = is_busy; break;
		case 40: BUSY_40 = is_busy; break;
		case 41: BUSY_41 = is_busy; break;
		case 42: BUSY_42 = is_busy; break;
		case 43: BUSY_43 = is_busy; break;
		case 44: BUSY_44 = is_busy; break;
		case 45: BUSY_45 = is_busy; break;
		case 46: BUSY_46 = is_busy; break;
		case 47: BUSY_47 = is_busy; break;
		case 48: BUSY_48 = is_busy; break;
		case 49: BUSY_49 = is_busy; break;
		case 50: BUSY_50 = is_busy; break;
		case 51: BUSY_51 = is_busy; break;
		case 52: BUSY_52 = is_busy; break;
		case 53: BUSY_53 = is_busy; break;
		case 54: BUSY_54 = is_busy; break;
		case 55: BUSY_55 = is_busy; break;
		case 56: BUSY_56 = is_busy; break;
		case 57: BUSY_57 = is_busy; break;
		case 58: BUSY_58 = is_busy; break;
		case 59: BUSY_59 = is_busy; break;
		case 60: BUSY_60 = is_busy; break;
		case 61: BUSY_61 = is_busy; break;
		case 62: BUSY_62 = is_busy; break;
		case 63: BUSY_63 = is_busy; break;
		case 64: BUSY_64 = is_busy; break;
		case 65: BUSY_65 = is_busy; break;
		case 66: BUSY_66 = is_busy; break;
		case 67: BUSY_67 = is_busy; break;
		case 68: BUSY_68 = is_busy; break;
		case 69: BUSY_69 = is_busy; break;
		case 70: BUSY_70 = is_busy; break;
		case 71: BUSY_71 = is_busy; break;
		case 72: BUSY_72 = is_busy; break;
		case 73: BUSY_73 = is_busy; break;
		case 74: BUSY_74 = is_busy; break;
		case 75: BUSY_75 = is_busy; break;
		case 76: BUSY_76 = is_busy; break;
		case 77: BUSY_77 = is_busy; break;
		case 78: BUSY_78 = is_busy; break;
		case 79: BUSY_79 = is_busy; break;
		case 80: BUSY_80 = is_busy; break;
		case 81: BUSY_81 = is_busy; break;
		case 82: BUSY_82 = is_busy; break;
		case 83: BUSY_83 = is_busy; break;
		case 84: BUSY_84 = is_busy; break;
		case 85: BUSY_85 = is_busy; break;
		case 86: BUSY_86 = is_busy; break;
		case 87: BUSY_87 = is_busy; break;
		case 88: BUSY_88 = is_busy; break;
		case 89: BUSY_89 = is_busy; break;
		case 90: BUSY_90 = is_busy; break;
		case 91: BUSY_91 = is_busy; break;
		case 92: BUSY_92 = is_busy; break;
		case 93: BUSY_93 = is_busy; break;
		case 94: BUSY_94 = is_busy; break;
		case 95: BUSY_95 = is_busy; break;
		case 96: BUSY_96 = is_busy; break;
		case 97: BUSY_97 = is_busy; break;
		case 98: BUSY_98 = is_busy; break;
		case 99: BUSY_99 = is_busy; break;
	}

}

function core___check_busy(index) {
	switch (index) {
		case 0: return BUSY_0;
		case 1: return BUSY_1;
		case 2: return BUSY_2;
		case 3: return BUSY_3;
		case 4: return BUSY_4;
		case 5: return BUSY_5;
		case 6: return BUSY_6;
		case 7: return BUSY_7;
		case 8: return BUSY_8;
		case 9: return BUSY_9;
		case 10: return BUSY_10;
		case 11: return BUSY_11;
		case 12: return BUSY_12;
		case 13: return BUSY_13;
		case 14: return BUSY_14;
		case 15: return BUSY_15;
		case 16: return BUSY_16;
		case 17: return BUSY_17;
		case 18: return BUSY_18;
		case 19: return BUSY_19;
		case 20: return BUSY_20;
		case 21: return BUSY_21;
		case 22: return BUSY_22;
		case 23: return BUSY_23;
		case 24: return BUSY_24;
		case 25: return BUSY_25;
		case 26: return BUSY_26;
		case 27: return BUSY_27;
		case 28: return BUSY_28;
		case 29: return BUSY_29;
		case 30: return BUSY_30;
		case 31: return BUSY_31;
		case 32: return BUSY_32;
		case 33: return BUSY_33;
		case 34: return BUSY_34;
		case 35: return BUSY_35;
		case 36: return BUSY_36;
		case 37: return BUSY_37;
		case 38: return BUSY_38;
		case 39: return BUSY_39;
		case 40: return BUSY_40;
		case 41: return BUSY_41;
		case 42: return BUSY_42;
		case 43: return BUSY_43;
		case 44: return BUSY_44;
		case 45: return BUSY_45;
		case 46: return BUSY_46;
		case 47: return BUSY_47;
		case 48: return BUSY_48;
		case 49: return BUSY_49;
		case 50: return BUSY_50;
		case 51: return BUSY_51;
		case 52: return BUSY_52;
		case 53: return BUSY_53;
		case 54: return BUSY_54;
		case 55: return BUSY_55;
		case 56: return BUSY_56;
		case 57: return BUSY_57;
		case 58: return BUSY_58;
		case 59: return BUSY_59;
		case 60: return BUSY_60;
		case 61: return BUSY_61;
		case 62: return BUSY_62;
		case 63: return BUSY_63;
		case 64: return BUSY_64;
		case 65: return BUSY_65;
		case 66: return BUSY_66;
		case 67: return BUSY_67;
		case 68: return BUSY_68;
		case 69: return BUSY_69;
		case 70: return BUSY_70;
		case 71: return BUSY_71;
		case 72: return BUSY_72;
		case 73: return BUSY_73;
		case 74: return BUSY_74;
		case 75: return BUSY_75;
		case 76: return BUSY_76;
		case 77: return BUSY_77;
		case 78: return BUSY_78;
		case 79: return BUSY_79;
		case 80: return BUSY_80;
		case 81: return BUSY_81;
		case 82: return BUSY_82;
		case 83: return BUSY_83;
		case 84: return BUSY_84;
		case 85: return BUSY_85;
		case 86: return BUSY_86;
		case 87: return BUSY_87;
		case 88: return BUSY_88;
		case 89: return BUSY_89;
		case 90: return BUSY_90;
		case 91: return BUSY_91;
		case 92: return BUSY_92;
		case 93: return BUSY_93;
		case 94: return BUSY_94;
		case 95: return BUSY_95;
		case 96: return BUSY_96;
		case 97: return BUSY_97;
		case 98: return BUSY_98;
		case 99: return BUSY_99;
	}
	return null;

}

function core___get_data_by_index(index) {
	switch (index) {
		case 0: return DATA_0;
		case 1: return DATA_1;
		case 2: return DATA_2;
		case 3: return DATA_3;
		case 4: return DATA_4;
		case 5: return DATA_5;
		case 6: return DATA_6;
		case 7: return DATA_7;
		case 8: return DATA_8;
		case 9: return DATA_9;
		case 10: return DATA_10;
		case 11: return DATA_11;
		case 12: return DATA_12;
		case 13: return DATA_13;
		case 14: return DATA_14;
		case 15: return DATA_15;
		case 16: return DATA_16;
		case 17: return DATA_17;
		case 18: return DATA_18;
		case 19: return DATA_19;
		case 20: return DATA_20;
		case 21: return DATA_21;
		case 22: return DATA_22;
		case 23: return DATA_23;
		case 24: return DATA_24;
		case 25: return DATA_25;
		case 26: return DATA_26;
		case 27: return DATA_27;
		case 28: return DATA_28;
		case 29: return DATA_29;
		case 30: return DATA_30;
		case 31: return DATA_31;
		case 32: return DATA_32;
		case 33: return DATA_33;
		case 34: return DATA_34;
		case 35: return DATA_35;
		case 36: return DATA_36;
		case 37: return DATA_37;
		case 38: return DATA_38;
		case 39: return DATA_39;
		case 40: return DATA_40;
		case 41: return DATA_41;
		case 42: return DATA_42;
		case 43: return DATA_43;
		case 44: return DATA_44;
		case 45: return DATA_45;
		case 46: return DATA_46;
		case 47: return DATA_47;
		case 48: return DATA_48;
		case 49: return DATA_49;
		case 50: return DATA_50;
		case 51: return DATA_51;
		case 52: return DATA_52;
		case 53: return DATA_53;
		case 54: return DATA_54;
		case 55: return DATA_55;
		case 56: return DATA_56;
		case 57: return DATA_57;
		case 58: return DATA_58;
		case 59: return DATA_59;
		case 60: return DATA_60;
		case 61: return DATA_61;
		case 62: return DATA_62;
		case 63: return DATA_63;
		case 64: return DATA_64;
		case 65: return DATA_65;
		case 66: return DATA_66;
		case 67: return DATA_67;
		case 68: return DATA_68;
		case 69: return DATA_69;
		case 70: return DATA_70;
		case 71: return DATA_71;
		case 72: return DATA_72;
		case 73: return DATA_73;
		case 74: return DATA_74;
		case 75: return DATA_75;
		case 76: return DATA_76;
		case 77: return DATA_77;
		case 78: return DATA_78;
		case 79: return DATA_79;
		case 80: return DATA_80;
		case 81: return DATA_81;
		case 82: return DATA_82;
		case 83: return DATA_83;
		case 84: return DATA_84;
		case 85: return DATA_85;
		case 86: return DATA_86;
		case 87: return DATA_87;
		case 88: return DATA_88;
		case 89: return DATA_89;
		case 90: return DATA_90;
		case 91: return DATA_91;
		case 92: return DATA_92;
		case 93: return DATA_93;
		case 94: return DATA_94;
		case 95: return DATA_95;
		case 96: return DATA_96;
		case 97: return DATA_97;
		case 98: return DATA_98;
		case 99: return DATA_99;
	}
	return null;

}

function core___init_queue() {
	QUEUE.process("0", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("1", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("2", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("3", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("4", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("5", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("6", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("7", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("8", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("9", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("10", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("11", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("12", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("13", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("14", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("15", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("16", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("17", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("18", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("19", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("20", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("21", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("22", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("23", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("24", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("25", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("26", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("27", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("28", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("29", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("30", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("31", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("32", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("33", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("34", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("35", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("36", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("37", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("38", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("39", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("40", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("41", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("42", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("43", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("44", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("45", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("46", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("47", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("48", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("49", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("50", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("51", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("52", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("53", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("54", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("55", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("56", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("57", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("58", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("59", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("60", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("61", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("62", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("63", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("64", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("65", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("66", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("67", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("68", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("69", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("70", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("71", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("72", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("73", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("74", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("75", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("76", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("77", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("78", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("79", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("80", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("81", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("82", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("83", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("84", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("85", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("86", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("87", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("88", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("89", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("90", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("91", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("92", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("93", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("94", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("95", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("96", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("97", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("98", TOTAL_PROCESS_ONCE, core___process);
	QUEUE.process("99", TOTAL_PROCESS_ONCE, core___process);

}

core___init_queue();

//#endregion

//#region [ CORE ]

function core___get_index(name) {
	const index = NANES.indexOf(name);
	if (index != -1) return index;
	return null;
}

function core___get_data(name) {
	const index = core___get_index(name);
	if (index) return core___get_data_by_index(index);
	return null;
}

function core___process(job, done) {
	const message = job.data;
	console.log('JOB_PROCESS: ', message);
	
	if (message == null) message = { ___k: 0 };
	if (message.___k == null) message.___k = 0;

	if (message.___id == null)
		return done({ ok: false, message: 'Message ___id is null ...', request: message });

	const index = core___get_index(name);
	if (index = null)
		return done({ ok: false, message: 'Message ___id is null ...', request: message });

	const busy = core___check_busy(index);
	if (busy == true) {
		if (message.___k < 9) {
			setTimeout(function (m, d) {
				m.___k++;
				core___process(m, d);
			}, 100, message, done);
			return;
		} else {
			const s = 'Message ' + message.___id + ' do not process. System very busy ...';
			console.log(s)
			return done({ ok: false, message: s, request: message });
		}
	}

	const data = core___get_data_by_index(index);
	if (data == null)
		return done({ ok: false, message: 'Message ___id is null ...', request: message });

	const max = data.length;
	if (max == 0)
		return done({ ok: true, request: message, response: { ok: true, data: [], total: 0, count: 0, pagesize: PAGE_SIZE, page: 1 } });

	const results = [];
	if (message.condition == null || message.condition.length == 0) {
		const len = max > PAGE_SIZE ? PAGE_SIZE : max;
		for (var i = 0; i < len; i++) results.push(0);
		for (var i = 0; i < len; i++) results[i] = data[i];

		return done({ ok: true, request: message, response: { ok: true, data: results, total: 0, count: len, pagesize: PAGE_SIZE, page: 1 } });
	}
	
	const f_condition = new Function('o', message.condition);
	for (var i = 0; i < max; i++) {
		if (data[i] == null)
			return done({ ok: false, message: 'Record to filter is null', request: message });

		try {
			if (f_condition(data[i]) == true) results.push(data[i]);
		} catch (e) {
			return done({ ok: false, message: e.message + '\r\nERROR_FILTER: Throw when filter record: ' + JSON.stringify(data[i]), request: message });
		}

		if (results.length == PAGE_SIZE) break;
	}

	done({ ok: true, request: message, response: { ok: true, data: results, total: max, count: results.length, pagesize: PAGE_SIZE, page: 1 } });
}


QUEUE.on('error', function (err) {
	console.log('JOB_ERROR = ', err);
});

QUEUE.on('job enqueue', function (id, type) {
	console.log('JOB_ENQUEUE [ %s ] -> id =  %s', type, id);
});

QUEUE.on('job complete', function (id, result) {
	console.log('JOB_COMPLETE [ %s ] -> result = ', id);

	//kue.Job.get(id, function (err, job) {
	//	if (err) return;
	//	job.remove(function (err) {
	//		if (err) throw err;
	//		console.log('removed completed job #%d', job.id);
	//	});
	//});
});


//#endregion


//Read terminal Lines
const READLINE = require("readline");
const RL = READLINE.createInterface({
	input: process.stdin,
	output: process.stdout
});
RL.on("line", function (text) {
	const cmd = text.split(' ')[0].toLowerCase();
	switch (cmd) {
		case 'exit':
			process.exit();
			break;
		case 'cls':
			console.clear();
			break;
		case 'test':

			QUEUE.create('0', { condition: '' }).save();

			break;
		default:
			break;
	}
});




