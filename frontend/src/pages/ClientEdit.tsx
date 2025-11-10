import CreateEditPage from "../components/CreateEditPage";
import * as ClientBindings from "../../wailsjs/go/bindings/ClientBindings";
import { models } from "../../wailsjs/go/models";

type Client = models.Client;

const initialClient: Client = {
  ID: 0,
  Name: "",
  Phone: "",
  Email: "",
  Description: "",
} as Client;

export default function ClientEdit() {
  return (
    <CreateEditPage<Client>
      title="Управление клиентом"
      listRoute="/clients"
      fetchById={ClientBindings.GetByID}
      create={ClientBindings.Create}
      update={ClientBindings.Update}
      initialValue={initialClient}
      fields={[
        { name: "Name", label: "Имя", type: "text" },
        { name: "Phone", label: "Телефон", type: "text" },
        { name: "Email", label: "Email", type: "text" },
        { name: "Description", label: "Описание", type: "textarea" },
      ]}
    />
  );
}
