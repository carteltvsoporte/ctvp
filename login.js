const authorizedUsers=[
    {name:"Marcos",phone:"50369270"},
    {name:"Luis Miguel Vidal Oliva",phone:"55814361"},
    {name:"Angel",phone:"59512602"},
];

function findUserMatch(name,phone){
    const cleanName=name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const cleanPhone=phone.replace(/\s+/g,'').replace(/[^\d]/g,'');
    return authorizedUsers.find(user=>{
        const userCleanPhone=user.phone.replace(/\s+/g,'').replace(/[^\d]/g,'');
        if(userCleanPhone!==cleanPhone)return false;
        const userCleanName=user.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
        return cleanName===userCleanName;
    });
}

document.addEventListener('DOMContentLoaded',function(){
    checkExistingAuth();
    const authTabs=document.querySelectorAll('.auth-tab');
    const authForms=document.querySelectorAll('.auth-form');
    authTabs.forEach(tab=>{
        tab.addEventListener('click',function(){
            const tabName=this.dataset.tab;
            authTabs.forEach(t=>t.classList.remove('active'));
            this.classList.add('active');
            authForms.forEach(form=>{
                form.classList.remove('active');
                if(form.id===`${tabName}-form`)form.classList.add('active');
            });
        });
    });
    document.getElementById('login-form').addEventListener('submit',function(e){
        e.preventDefault();
        const name=document.getElementById('login-name').value.trim();
        const phone=document.getElementById('login-phone').value.trim();
        const messageEl=document.getElementById('login-message');
        if(!name||!phone){
            showMessage(messageEl,'Completa todos los campos.','error');
            return;
        }
        const userMatch=findUserMatch(name,phone);
        if(userMatch){
            showMessage(messageEl,'Acceso concedido. Redirigiendo...','success');
            const userSession={
                name:userMatch.name,
                phone:userMatch.phone,
                loginTime:new Date().toISOString()
            };
            localStorage.setItem('ctvp_user_session',JSON.stringify(userSession));
            setTimeout(()=>{
                window.location.href='index.html';
            },1500);
        }else{
            showMessage(messageEl,'Usuario no autorizado. Verifica tus datos.','error');
        }
    });
    document.getElementById('register-form').addEventListener('submit',function(e){
        e.preventDefault();
        const name=document.getElementById('register-name').value.trim();
        const phone=document.getElementById('register-phone').value.trim();
        const messageEl=document.getElementById('register-message');
        if(!name||!phone){
            showMessage(messageEl,'Completa todos los campos.','error');
            return;
        }
        const userMatch=findUserMatch(name,phone);
        if(userMatch){
            showMessage(messageEl,'Ya estás autorizado. Inicia sesión.','info');
            document.querySelector('[data-tab="login"]').click();
            document.getElementById('login-name').value=name;
            document.getElementById('login-phone').value=phone;
        }else{
            sendRequestEmail(name,phone);
            showMessage(messageEl,'Solicitud enviada. Te contactaremos pronto.','success');
            this.reset();
        }
    });
    function showMessage(element,text,type){
        element.textContent=text;
        element.className=`message ${type}`;
        element.style.display='block';
        setTimeout(()=>element.style.display='none',5000);
    }
    function sendRequestEmail(name,phone){
        const email='carteltv.soporte@gmail.com';
        const subject=encodeURIComponent('Nueva Solicitud de Acceso - CTVP');
        const body=encodeURIComponent(`Solicitud de acceso:\n\n• Nombre: ${name}\n• Teléfono: ${phone}\n• Fecha: ${new Date().toLocaleString('es-ES')}`);
        const gmailUrl=`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
        window.open(gmailUrl,'gmailWindow','width=600,height=600,resizable=yes,scrollbars=yes');
    }
    function checkExistingAuth(){
        const userSession=localStorage.getItem('ctvp_user_session');
        if(userSession){
            try{
                const session=JSON.parse(userSession);
                const loginTime=new Date(session.loginTime);
                const now=new Date();
                const hoursDiff=(now-loginTime)/(1000*60*60);
                if(hoursDiff<24){
                    window.location.href='index.html';
                }
            }catch(e){
                console.error('Error verificando sesión:',e);
            }
        }
    }
});