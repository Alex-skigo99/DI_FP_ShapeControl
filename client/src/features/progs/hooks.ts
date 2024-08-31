import {useSelector} from 'react-redux';
import { getCurrentProgram, getPrograms} from "./progSlice";

export const useCurrentProgram = () => useSelector(getCurrentProgram);
export const usePrograms = () => useSelector(getPrograms);
