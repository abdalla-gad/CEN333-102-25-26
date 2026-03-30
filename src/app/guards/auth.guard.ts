import { inject } from '@angular/core'
import { Router } from '@angular/router'

export const authGuard = () =>{

    const auth = localStorage.getItem('cropguard_auth');
    if(auth==='true'){
        return true;
    }
    return inject(Router).createUrlTree(['/cropguardlogin']);

}



