"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPermissions = exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.find.js");
require("core-js/modules/esnext.iterator.map.js");
const utils = {
  filterFieldDataTypes: {
    Number: 'number',
    String: 'string',
    Boolean: 'boolean'
  },
  fixedFilterFormat: {
    date: "YYYY-MM-DD",
    datetime: "YYYY-MM-DD hh:mm:ss a",
    dateTimeLocal: "YYYY-MM-DD hh:mm:ss a",
    OverrideDateFormat: "DD-MMM-YYYY"
  },
  errorMapping: {
    413: "Upload failed: The file exceeds the 30 MB size limit. Please select a smaller file."
  },
  permissionsMapper: {
    add: "Permission2",
    edit: "Permission3",
    delete: "Permission4"
  },
  emptyIdValues: [null, undefined, '', '0', 0],
  t(sentence, i18nNext) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (!i18nNext) {
      return sentence;
    }
    if (!sentence) {
      return;
    }
    const {
      t,
      i18n
    } = i18nNext;
    if (!(t || i18n)) {
      return sentence;
    }
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    const isEdge = !isIE && !!window.StyleMedia;

    // Additional condition added for Edge and Firefox as they do not return only en instead return en-IN
    if ((i18n === null || i18n === void 0 ? void 0 : i18n.language) === "en" || (i18n === null || i18n === void 0 ? void 0 : i18n.language.split('-')[0]) === "en") {
      return t(sentence, options);
    }
    const optionKeys = Object.keys(options);
    let loweredSentence = [];
    // In case of non en language do not lowercase the variable , as lowercase it will result in value not updating in string
    if (optionKeys.length) {
      loweredSentence = sentence.split(" ");
      loweredSentence = loweredSentence.map(item => {
        if (item.includes("{{") && item.includes("}}") && isEdge) {
          return item;
        } else {
          return item.toLowerCase();
        }
      });
    }
    const tString = loweredSentence.length ? loweredSentence.join(" ") : sentence.toString().toLowerCase();
    const transformed = t(tString, options);
    if (sentence === sentence.toString().toUpperCase()) {
      return transformed.toString().toUpperCase();
    } else if (sentence === sentence.toString().toLowerCase()) {
      return transformed.toString().toLowerCase();
    } else {
      return transformed[0].toUpperCase() + transformed.substring(1);
    }
  }
};
const getPermissions = _ref => {
  let {
    userData = {},
    model,
    userDefinedPermissions
  } = _ref;
  const {
    permissions = []
  } = userData;
  userDefinedPermissions = userDefinedPermissions || {
    add: true,
    edit: true,
    delete: true
  };
  const userPermissions = permissions.find(item => item.Module === model.module);
  if (!userPermissions) {
    return {
      canAdd: userDefinedPermissions.add,
      canEdit: userDefinedPermissions.edit,
      canDelete: userDefinedPermissions.delete
    };
  }
  return {
    canAdd: userDefinedPermissions.add && Boolean(userPermissions[utils.permissionsMapper.add]),
    canEdit: userDefinedPermissions.edit && Boolean(userPermissions[utils.permissionsMapper.edit]),
    canDelete: userDefinedPermissions.delete && Boolean(userPermissions[[utils.permissionsMapper.delete]])
  };
};
exports.getPermissions = getPermissions;
var _default = exports.default = utils;