import PocketBase from "pocketbase";


const pb = new PocketBase(import.meta.env.VITE_PB_URL);
const RedirectUrl = "http://localhost:5173/";

pb.autoCancellation(false);
export default pb;

export const isUserValid = pb.authStore.isValid;    


export async function login(email ,password){ 
    await pb.collection('users').authWithPassword(email ,password);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.href = RedirectUrl;
}

export function signout(){
    pb.authStore.clear();
    window.location.href = RedirectUrl;
}

export async function deleteProject(id){
    let confirm = window.confirm("êtes-vous sûr de vouloir supprimer ce projet ?");
    if(!confirm){
        return;
    }
    await pb.collection('Projects').delete(id);
}
