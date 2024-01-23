import Icon from '../icon/index';
import styles from './index.module.scss';
import colors from "@/app/sass/_variables.module.scss";
import {  usePathname, useRouter, useSearchParams } from "next/navigation";


export default function CustomFloatButton() {
    const {push} = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('scan');

    const validateRoute = () => {
        return pathName.includes('/pages/entry') && query 
       
    }

    const handleClick = () => {
       validateRoute() ?  push('/pages/entry') :  push('/pages/entry?scan=true')
    }

    return (
         <div onClick={handleClick} className={styles.floatButton}>
            <Icon icon={`${validateRoute() ? 'close' : 'scan' }`} size={validateRoute() ? 24 : 32} color={colors.neutralColorGraySoftest} />
         </div>
    )
}