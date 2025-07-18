import { makeStyles } from "@material-ui/core";
import { Avatar, useTheme } from "@mui/material";

const useStyles = makeStyles({
    root: {
        display: 'flex'
    }
})
export const brandBackgroundColor = '#182eb5';
export const brandColor = '#ffffff';
function RenderDayCell({ value }) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dayValues = value.split('');
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div className={classes.root}>
            {dayValues.map((val, index) => (
                <Avatar
                    key={index}
                    sx={{
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
                    }}
                >
                    {days[index]}
                </Avatar>
            ))}
        </div>
    );
}

export {
    RenderDayCell
}