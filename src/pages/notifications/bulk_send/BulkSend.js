import { DialogActions, Grid } from '@mui/material';
import Button from 'components/button';
import TextField from 'components/formik/textfield';
import HttpService from 'components/httpService';
import Http from 'components/httpService/Http';
import api from 'components/httpService/api';
import { Form, Formik } from 'formik';
import { memo, useState } from 'react';
import * as yup from 'yup';
import AddOneFrom from '../AddOne';

const validationSchema = yup.object({
  message: yup.string().required(),
  user_ids: yup.string()
});
const initialForm = {
  user_ids: '',
  level: 0,
  message: '',
  status: 'pending',
  user_id: 0,
  type: 'general',
  engine: 'telegram',
  approve: true,
  keyboard: '[]',
  photo_url: ''
};

const BulkSend = (props) => {
  const { refrence } = props;
  const [postDataLoading, setPostDataLoading] = useState(false);

  const handleSubmit = (values) => {
    setPostDataLoading(true);
    let formattedUserIds = [];
    if (values.user_ids.trim()) {
      // Check if the string is not empty or just whitespace
      formattedUserIds = values.user_ids.split('\n').filter((id) => id.trim() !== '');
    }
    HttpService()
      .post(`${api.notifications}/bulk_send`, {
        user_ids: formattedUserIds,
        notification: {
          ...values
        }
      })
      .then((res) => {
        Http.success(res);
        refrence.current.changeStatus();
      })
      .catch((err) => Http.error(err))
      .finally(() => {
        setPostDataLoading(false);
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialForm}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form>
          <Grid container spacing={3} rowSpacing={2} justifyContent={'center'}>
            <Grid item xs={12}>
              <TextField
                id={'user_ids'}
                name={'user_ids'}
                label="Account IDs"
                type="text"
                minRows={4}
                multiline
              />
            </Grid>
            <AddOneFrom {...values} />
          </Grid>
          <DialogActions>
            <Button
              autoFocus
              variant={'outlined'}
              type="submit"
              isLoading={postDataLoading}
              color="primary"
            >
              Submit
            </Button>
            <Button
              variant={'outlined'}
              color="error"
              onClick={() => refrence.current.changeStatus()}
            >
              Cancell
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default memo(BulkSend);
