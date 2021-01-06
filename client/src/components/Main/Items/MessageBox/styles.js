import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '40vh',
    width: '49vw'
  },
  mroot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '90vh',
    width: '100vw',
    alignSelf: 'center'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  mtabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '30vw'
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  chatPaper: {
    overflow:'auto',
    height: '28vh',
    width: '39vw'
  },
  mchatPaper: {
    overflow:'auto',
    height: '70vh',
    width: '80vw',
    alignSelf:'center'
  },
  msgPaper: {
    padding: 2, 
    borderRadius: 3, 
    margin: 8,
    width: '50%',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    clear:'both',
  },
  msgPaperYours: {
    padding: 2, 
    borderRadius: 3, 
    margin: 8,
    float: 'right',
    clear:'both',
    width: '50%',
    backgroundColor: 'whitesmoke',
    color: '#111111'
  },
  sendBar: {
    display: 'flex', 
    flexDirection: 'row', 
    padding: 10,
    maxHeight: '8vh'
  },
  msgText: {
    margin: 5, 
    fontWeight: 500, 
    whiteSpace: 'pre-wrap', 
    wordWrap: "break-word", 
    maxWidth: '30vw'
  },
  msgTS: {
    margin: 4, 
    marginLeft: 5, 
    fontSize: 10
  },
  circleProg: {
    marginTop: 10, 
    display: 'flex', 
    justifyContent: 'center'
  },
  formControl: {
    margin: theme.spacing(2),
  },
  delegateSelector: {
    maxHeight: '4vh',
    height: '4vh',
    width: '20vw',
  },
}));