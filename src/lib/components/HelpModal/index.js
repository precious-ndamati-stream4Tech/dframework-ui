import React, { useEffect, useState } from 'react';
import {
    Grid, Typography,
    Dialog, DialogContent, DialogTitle,
} from '@mui/material';
import { Replay, Close } from '@material-ui/icons';
import { useStateContext } from '../useRouter/StateProvider';
import actionsStateProvider from '../useRouter/actions';

const HelpModal = () => {
    const [height, setHeight] = useState();
    const [loading, setLoading] = useState(false);
    const { stateData, dispatchData } = useStateContext()
    const openModal = stateData.modal; //useSelector(state => state.appReducer.modal);
    const ratio = 16 / 9;
    let zoom = ((window.outerWidth - 10) / window.innerWidth) * 100;
    const updateHeight = () => {
        let widthPercentage = document.getElementById('tutorial-iframe');
        if (widthPercentage) {
            widthPercentage = widthPercentage.offsetWidth;
            widthPercentage = widthPercentage / window.innerWidth;
        } else {
            widthPercentage = 0.9;
        }
        const calculatedHeight = window.innerWidth * widthPercentage * (1 / ratio);
        const maxHeight = window.innerHeight - 180;
        setHeight(Math.min(calculatedHeight, maxHeight));
    };
    useEffect(() => {
        if (openModal?.status) {
            setLoading(true);
            updateHeight();
        }
    }, [openModal, zoom])

    useEffect(() => {
        window.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
        }
    }, [])

    function resetIframe() {
        const iframe = document.getElementById('tutorial-iframe');
        iframe.src = openModal?.data?.url;
    }

    return (
        <div>
            {openModal?.status &&
                <Dialog fullWidth={true} maxWidth={"lg"} open={openModal.status} onClose={() => {
                    dispatchData({
                        type: actionsStateProvider.OPEN_MODAL, payload: { status: false, data: {}, }
                    })
                }} >
                    <DialogTitle className='pt-2 pb-0'>
                        <Grid container spacing={1}>
                            <Grid item className="" xs={11} sm={11} md={11} lg={11} >
                                <Typography variant="h7" component='div'> {openModal?.data?.title || ''}</Typography>
                                <Typography variant="caption" component='div'>{openModal?.data?.subTitle || <>&nbsp;</>}</Typography>
                            </Grid>
                            <Grid item className="text-right" xs={1} sm={1} md={1} lg={1} >
                                <Replay className='cursor_pointer mt-2 mr-2' onClick={resetIframe} />
                                <Close className='cursor_pointer mt-2' onClick={() => {
                                    dispatchData({
                                        type: actionsStateProvider.OPEN_MODAL, payload: { status: false, data: {} }
                                    })
                                }} />
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent dividers>
                        {loading && <div>{"Loading..."}</div>}
                        {openModal?.data?.url && <iframe
                            id='tutorial-iframe'
                            style={{ width: '100%', height: `${height}px` }}
                            title={openModal?.data?.title || ''}
                            src={openModal?.data?.url}
                            allowfullscreen
                            frameborder="0"
                            loading="lazy"
                            onLoad={() => setLoading(false)}
                        />}
                    </DialogContent>
                </Dialog>}
        </div>
    )
}

export default HelpModal