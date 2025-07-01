import HttpService from 'components/httpService';
import api from 'components/httpService/api';

export const getAllInbounds = () => {
  return new Promise((res, rej) => {
    HttpService()
      .get(api.inboundConfigs)
      .then(({ data }) => {
        res(data.inbounds);
      })
      .catch((err) => rej(err));
  });
};

export const createInboundConfig = (data) => {
  return new Promise((res, rej) => {
    HttpService()
      .post(api.inboundConfigs, data)
      .then(({ data }) => {
        res(data);
      })
      .catch((err) => rej(err));
  });
};

export const updateInboundConfig = (id, data) => {
  return new Promise((res, rej) => {
    HttpService()
      .put(`${api.inboundConfigs}/${id}`, data)
      .then(({ data }) => {
        res(data);
      })
      .catch((err) => rej(err));
  });
};
