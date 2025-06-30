import { Contact, ContactGroup } from "@prisma/client";
import { Flex, Text } from "@radix-ui/themes";
import ContactStatusBadge from "../../components/ContactGroupBadge";
interface Props {
  contact: Contact & { group: ContactGroup };
}

const ContactLabel = ({ contact }: Props) => {
  return (
    <Flex gap="2" wrap="wrap">
      <Text>{contact.name}</Text>
      <ContactStatusBadge ContactGroup={contact.group} />
      {contact.phone && <Text>- {contact.phone}</Text>}
      {contact.cccd && <Text>- {contact.cccd}</Text>}
      {contact.address && <Text>- {contact.address}</Text>}
    </Flex>
  );
};

export default ContactLabel;
