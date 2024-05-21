import jwt_decode from 'jwt-decode';
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('jwt')) {
        const { exp } : any = jwt_decode(JSON.parse(localStorage.getItem('jwt') || "{}") );
        if((new Date()).getTime() < exp * 1000){
            return true;
        }else{
            localStorage.removeItem('jwt');
            return false
        }

    } else return false;
}

export const userInfo  = <T extends object>(t: any): T=> {
    const jwt = JSON.parse(localStorage.getItem('jwt') || "{}");
    const decoded = jwt_decode(jwt);
    return { ...(decoded as object) , token: jwt} as T
}

export const authenticate = (token : string, cb : any) => {

    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(token));
        cb();
    }
}