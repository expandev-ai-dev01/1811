import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { carService } from '../../services/carService';
import type { CarFilterParams } from '../../types';

export const useCarList = (params: CarFilterParams) => {
  return useQuery({
    queryKey: ['cars', params],
    queryFn: () => carService.list(params),
    placeholderData: keepPreviousData,
  });
};
