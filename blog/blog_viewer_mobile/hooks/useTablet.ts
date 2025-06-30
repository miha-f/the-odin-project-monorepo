import { useWindowDimensions } from 'tamagui'

export const useTablet = () => {
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    return { isTablet };
};
