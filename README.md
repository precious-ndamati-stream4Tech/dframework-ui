# how we will use the durlabh/dframework-ui 


**:** In Dframework we have create Multple Component for for our Use 

**1:**  SnackBar
**2:**  Dialog
**3:**  Grid
**4:**  ChildGrid




**Example:**  ************************************************ Example of SnackBar **********************
# How we will use the SnackBar Component 
## frist import in your Index.js folder of your Project
```js

import React from 'react';
import {SnackbarProvider} from '@durlabh/dfamework-ui';
export default function App() {
  return (
      <SnackbarProvider SnackbarProps={{ autoHideDuration: 1000 }}>
          ******************* Import Your Component ********************
      </SnackbarProvider>
  );
}
```


## Then use in Your Project 

```js

import React from 'react';
import { useSnackbar } from '@durlabh/dfamework-ui';
export default function App() {
const snac = useSnackbar();
  return (
    <div>
      <Button variant="contained" color="primary"
        onClick={() => snac.showMessage('An error occured, please try after some time.')}>
        Show Snackbar
      </Button> 
    </div>
  )
}
```

**Example:**  ************************************************ Example of Dialog **********************


# How we will use the Dialog Component 
```js
import {DialogComponent} from '@durlabh/dfamework-ui';
import React from 'react'
import 
export default function App() {
  return (
    <div>
       <DialogComponent open={true}  onCancel={false} title="Confirm Delete"  children ="Are you sure you want to delete "/>
    </div>
  )
}
```

**Example:**  ************************************************ Example of Grid **********************


# Example of Grid 

```js

import React from 'react'
import {UiModel} from './lib/components/Grid/ui-models';
export default function App() {
const surveyModel = new UiModel({
    title: "Questionnaires",
    defaultSort: 'SurveyTypeName ASC',
    linkColumn: 'SurveyTypeName',
    titleDescription: 'Build flexible questionnaire for use in Surveys',
    api: 'SurveyType',
    idProperty: "id",
    columns: [
        { field: "id", type: 'number',  flex: 1, headerName: "User Id", fieldLabel: null, pinned: true },
        { field: "title", type:"string",  headerName: "User Post Id", flex:1 },      
        { field: "Completed", type:"boolean",  headerName: "Completion Status", flex:1}  
    ]
});
  return (
    <div>
       <surveyModel.Grid/>
    </div>
  )
}

```



# Example of ChildGrid of Grid

```js

import React from 'react'
import {UiModel} from './lib/components/Grid/ui-models';
export default function App() {
const surveyModel = new UiModel({
    title: "Questionnaires",
    defaultSort: 'SurveyTypeName ASC',
    linkColumn: 'SurveyTypeName',
    titleDescription: 'Build flexible questionnaire for use in Surveys',
    api: 'SurveyType',
    idProperty: "id",
    columns: [
        { field: "id", type: 'number',  flex: 1, headerName: "User Id", fieldLabel: null, pinned: true },
        { field: "title", type:"string",  headerName: "User Post Id", flex:1 },      
        { field: "Completed", type:"boolean",  headerName: "Completion Status", flex:1}  
    ]
});
  return (
    <div>
       <surveyModel.ChildGrid/>
    </div>
  )
}

```