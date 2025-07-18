"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderDayCell = RenderDayCell;
exports.brandColor = exports.brandBackgroundColor = void 0;
require("core-js/modules/esnext.iterator.constructor.js");
require("core-js/modules/esnext.iterator.map.js");
var _core = require("@material-ui/core");
var _material = require("@mui/material");
const useStyles = (0, _core.makeStyles)({
  root: {
    display: 'flex'
  }
});
const brandBackgroundColor = exports.brandBackgroundColor = '#182eb5';
const brandColor = exports.brandColor = '#ffffff';
function RenderDayCell(_ref) {
  let {
    value
  } = _ref;
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayValues = value.split('');
  const classes = useStyles();
  const theme = (0, _material.useTheme)();
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, dayValues.map((val, index) => /*#__PURE__*/React.createElement(_material.Avatar, {
    key: index,
    sx: {
      backgroundColor: val === '1' ? theme.palette.success.main : brandColor,
      color: val === '1' ? 'white' : 'black',
      marginRight: '5px',
      width: '25px',
      height: '25px',
      fontSize: '0.65rem',
      lineHeight: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: "1px solid grey"
    }
  }, days[index])));
}