import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PiUser } from "react-icons/pi";
import { useDisclosure, useToast } from "@chakra-ui/react";

import CustomInput from "@components/ui/CustomInput.tsx";
import ModalForm from "@components/ui/forms/ModalForm.tsx";
import CustomSelect from "@components/ui/CustomSelect.tsx";
import ChoosablePermissionList from "@features/employees/components/ChoosablePermissionList.tsx";

import { createUser, updateUser } from "@features/employees/api/actions.ts";
import { useAppSelector } from "@hooks/useAppSelector.ts";
import { useActionState } from "@hooks/useActionState.ts";
import { CreateEditMemberFormProps } from "@interfaces/components.ts";
import { convertTime } from "@utils/formatters.ts";
import { schemas } from "@utils/inputHelpers.ts";
import { ERROR_DURATION, workTime } from "@constants";

function CreateEditMemberForm({ formData, isEditing, children }: CreateEditMemberFormProps) {
    const [permissions, setPermissions] = useState(formData?.permissions || [])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { loading: createUserLoading, error: createUserError } = useActionState(createUser);
    const { loading: updateUserLoading, error: updateUserError } = useActionState(updateUser);

    const loading = createUserLoading || updateUserLoading;
    const error = createUserError || updateUserError;

    const roles = useAppSelector((state) => state.roles.roles);
    const roleOptions = roles?.map(role => ({
        name: role.id,
        description: role.name
    }));

    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        if (!formData?.permissions) {
            const defaultPermissions = roles[0]?.defaultPermissions || [];
            setPermissions(defaultPermissions);
        }
        return;
    }, [formData?.permissions, isOpen, roles])

    const defaultFormData = {
        name: "",
        surname: "",
        email: "",
        role: roles[0]?.id,
        permissions: roles[0]?.defaultPermissions || [],
        timeload: "08:00"
    }

    const initialValues = {
        id: formData?.id,
        name: formData?.name,
        email: formData?.email,
        surname: formData?.surname,
        role: formData?.role?.id,
        timeload: formData?.timeload,
        permissions: formData?.permissions,
    }

    function handleSubmit(values) {
        setIsSubmitting(true);

        const { role, email, ...rest } = values;
        const data = isEditing ? rest : { ...rest, email };

        const completeValues = {
            ...data,
            timeload: convertTime(values.timeload),
            permissions: permissions,
            roleId: role
        };

        isEditing
            ? dispatch(updateUser(completeValues))
            : dispatch(createUser(completeValues));
    }

    useEffect(() => {
        if (!isSubmitting || loading || !isOpen)
            return
        setIsSubmitting(false)
        if (error) {
            toast({
                title: "An error occurred",
                description: error.message,
                status: "error",
                duration: ERROR_DURATION,
                isClosable: true,
            });
            return;
        }
        if (!error)
            onClose()
    }, [error, isOpen, isSubmitting, loading, onClose, toast]);

    function handleChangePermissions(e: ChangeEvent<HTMLInputElement>, permission: string) {
        setPermissions(e.target.checked
            ? [...permissions, permission]
            : permissions?.filter((perm) => perm !== permission));
    }

    function handleChangeRole(e: ChangeEvent<HTMLInputElement>) {
        const roleId = e.target.value;
        const defaultPermissions = roles?.find(({ id }) => id === roleId)?.defaultPermissions || [];

        setPermissions(defaultPermissions);
    }

    const workTimeList = workTime.map(time => ({
        name: time,
        description: time
    }));

    return (
        <ModalForm
            title={isEditing ? "Edit member" : "New member"}
            titleIcon={<PiUser size="24px"/>}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            submitBtnLoading={loading}
            submitBtnText={isEditing ? "Edit" : "Add"}
            triggerBtn={children}
            validationSchema={schemas.createEditMemberFormSchema}
            initialValues={formData ? initialValues : defaultFormData}
        >
            <CustomInput
                label="Name"
                name="name"
                type="text"
            />
            <CustomInput
                label="Surname"
                name="surname"
                type="text"
            />
            <CustomInput
                label="Email"
                name="email"
                type="email"
                isDisabled={isEditing}
            />
            <CustomSelect
                label="Role"
                name="role"
                options={roleOptions}
                onChange={handleChangeRole}
            />
            <CustomSelect
                label="Work Time"
                name="timeload"
                options={workTimeList}
            />
            <ChoosablePermissionList handleChangePermissions={handleChangePermissions} permissions={permissions}/>
        </ModalForm>
    );
}

export default CreateEditMemberForm;