import { memo, useEffect, useState } from 'react';
import { DialogActions, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import TextField from 'components/formik/textfield';
import Select from 'components/formik/select';
import * as yup from 'yup';
import Http from 'components/httpService/Http';
import { createInboundConfig, updateInboundConfig } from 'services/inboundConfigsService';
import Switch from 'components/formik/switch';
import useInbounds from 'hooks/useInbound';
import Button from 'components/button';
import MultipleSelect from 'components/formik/multiSelect';

const validationSchema = yup.object({
  remark: yup.string().required(),
  inbound_id: yup.number().required(),
  port: yup.number().required(),
  enable: yup.boolean().required(),
  alpns: yup.array().nullable(),
  develop: yup.boolean().required(),
  domain: yup
    .string()
    .matches(
      /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/,
      'Is not in correct Domain'
    )
    .required(),
  config_mode: yup.string().nullable(),
  extra: yup.string().nullable()
});

const types = [
  { id: 'vless', name: 'VLESS' },
  { id: 'vmess', name: 'VMESS' },
  { id: 'trojan', name: 'Trojan' },
  { id: 'shadowsocks', name: 'Shadowsocks' }
];
const securities = [
  { id: 'tls', name: 'TLS' },
  { id: 'reality', name: 'REALITY' },
  { id: 'none', name: 'None' }
];

const alpns = [
  { id: 'h2', name: 'h2' },
  { id: 'h3', name: 'h3' },
  { id: 'http/1.1', name: 'http/1.1' }
];
const networks = [
  { id: 'ws', name: 'Websocket' },
  { id: 'tcp', name: 'TCP' },
  { id: 'grpc', name: 'gRPC' },
  { id: 'kcp', name: 'kcp' },
  { id: 'http', name: 'http' },
  { id: 'httpupgrade', name: 'httpupgrade' },
  { id: 'xhttp', name: 'xhttp' }
];
const modes = [
  { id: 'auto', name: 'Auto' },
  { id: 'packet-up', name: 'Packet Up' },
  { id: 'stream-up', name: 'Stream Up' },
  { id: 'stream-one', name: 'Stream One' }
];
const fingerPrints = [
  { id: 'none', name: 'None' },
  { id: 'chrome', name: 'Chrome' },
  { id: 'firefox', name: 'FireFox' }
];

const initialForm = {
  host: '',
  id: '',
  remark: '',
  port: 0,
  domain: '',
  request_host: '',
  sni: '',
  address: '',
  path: '',
  pbk: '',
  sid: '',
  spx: '',
  alpns: [],
  security: 'tls',
  type: 'vless',
  enable: true,
  develop: false,
  finger_print: 'none',
  network: 'ws',
  inbound_id: '',
  config_mode: '',
  extra: ''
};

const AddEdit = (props) => {
  const { refrence, initial, createRow, editRow } = props;
  const [postDataLoading, setPostDataLoading] = useState(false);

  const { getInbounds, inbounds, isLoading } = useInbounds();

  useEffect(() => {
    getInbounds();
    return () => {};
  }, [getInbounds]);

  const handleCreate = (values) => {
    setPostDataLoading(true);
    createInboundConfig(values)
      .then((res) => {
        Http.success(res);
        refrence.current.changeStatus();
        createRow(res);
      })
      .catch((err) => Http.error(err))
      .finally(() => {
        setPostDataLoading(false);
      });
  };

  const handleEdit = (values) => {
    setPostDataLoading(true);
    updateInboundConfig(initial?.id, values)
      .then((res) => {
        Http.success(res);
        refrence.current.changeStatus();
        editRow(res);
      })
      .catch((err) => Http.error(err))
      .finally(() => {
        setPostDataLoading(false);
      });
  };

  return (
    <Formik
      initialValues={initial || initialForm}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        initial.id ? handleEdit(values) : handleCreate(values);
      }}
    >
      {() => (
        <Form>
          <Grid container spacing={2} rowSpacing={2}>
            <Grid item xs={12} md={4}>
              <TextField name="remark" label="Remark" />
            </Grid>
            <Grid item xs={12} md={4}>
              <Select
                name="inbound_id"
                label="Inbounds"
                labelName2={(item) => (
                  <Typography variant="body1" display={'flex'}>
                    <Typography fontWeight={800}>{item.host?.name}</Typography>
                    {'(' + item.remark + ')'}
                  </Typography>
                )}
                options={inbounds}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="port" label="Port" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="domain" label="Domain" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="host" label="Request Host" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="sni" label="SNI" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="address" label="Address" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="path" label="Path" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="pbk" label="PBK" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="sid" label="SID" />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField name="spx" label="SPX" />
            </Grid>
            <Grid item xs={12} md={4}>
              <MultipleSelect name="alpns" label="ALPN" labelName={'name'} options={alpns} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Select name="security" label="Security" options={securities} />
            </Grid>{' '}
            <Grid item xs={12} md={4}>
              <Select name="finger_print" label="Finger Print" options={fingerPrints} />
            </Grid>{' '}
            <Grid item xs={12} md={4}>
              <Select name="type" label="Type" options={types} />
            </Grid>{' '}
            <Grid item xs={12} md={4}>
              <Select name="network" label="Network" options={networks} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Select name="config_mode" label="Mode" options={modes} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Switch name="enable" label="Enable" />
              <Switch name="develop" label="Develop" />
            </Grid>
            <Grid item xs={12}>
              <TextField name="extra" label="Extra" multiline minRows={4} />
            </Grid>
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
              Cancel
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default memo(AddEdit);
