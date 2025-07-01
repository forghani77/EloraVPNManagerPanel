import { useCallback, useState } from 'react';
import { createInboundConfig, getAllInbounds } from 'services/inboundConfigsService';

const useInboundConfigs = () => {
  const [inboundConfigs, setInboundConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getInboundConfigs = useCallback(async () => {
    setIsLoading(true);
    try {
      const inbounds = await getAllInbounds();
      setInboundConfigs(inbounds);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, []);

  const addInboundConfigs = async (data) => {
    try {
      await createInboundConfig(data);
      getInboundConfigs();
    } catch (err) {
      console.log(err);
    }
  };

  return { getInboundConfigs, inboundConfigs, isLoading, addInboundConfigs };
};

export default useInboundConfigs;
