import  {beehive} from "../assets"
import {IonCard, IonCardContent} from "@ionic/react"
import { useNavigate } from "react_router_dom"
export function LockBackgroundElement ({contents}){

const navigate = useNavigate()
return (
        <IonCard onClick={(e) => navigate("/subscriptions", {host:true, replace:true})}
        style={{
            boxShadow:"none",
          backgroundImage: `url(${beehive})`,
          height: "100px",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}>
        <IonCardContent>
          {contents}
        </IonCardContent>
      </IonCard>
    )




}