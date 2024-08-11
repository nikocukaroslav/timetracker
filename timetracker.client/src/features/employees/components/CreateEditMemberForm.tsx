import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { BiHide, BiShow } from "react-icons/bi";
import { PiUser } from "react-icons/pi";
import { Box, FormLabel, InputGroup, InputRightElement, List, Select, Text, } from "@chakra-ui/react";

import CustomInput from "@components/ui/CustomInput.tsx";
import CustomSlider from "@components/ui/CustomSlider.tsx";
import ModalForm from "@components/ui/forms/ModalForm.tsx";
import PermissionItem from "./PermissionItem.tsx";
import RandomPasswordButton from "./RandomPasswordButton.tsx";

import { createUser, updateUser } from "../api/actions.ts";
import { useForm } from "@hooks/useForm.ts";
import { useAppSelector } from "@hooks/useAppSelector.ts";
import { generatePassword } from "@utils/generatePassword.ts";
import { CreateEditMemberFormProps } from "@interfaces/components.ts";
import { permissionList, positionsList } from "@constants";

const defaultFormData = {
    name: "",
    surname: "",
    email: "",
    password: "",
    position: positionsList[0].name,
    permissions: positionsList[0].defaultPermissions,
    timeload: 100
}

function CreateEditMemberForm({formData, isEditing, children}: CreateEditMemberFormProps) {
    const {
        data,
        isOpen,
        onOpen,
        onClose,
        setData,
        handleChangeInput,
        handleChangeValue
    } = useForm<typeof defaultFormData, typeof formData>(defaultFormData, formData);
    const {name, surname, email, password, position, permissions, timeload} = data;
    const [showPassword, setShowPassword] = useState(false);

    const loading = useAppSelector(state => state.employees.loading)
    const dispatch = useDispatch();

    function handleShowPassword() {
        setShowPassword(isShow => !isShow);
    }

    function handleUpdate() {
        const newUserData = {
            id: formData?.id,
            name,
            surname,
            position,
            permissions,
            timeload,
        };

        dispatch(updateUser(newUserData))
    }

    function handleAdd() {
        const newUser = {
            name,
            surname,
            email,
            password,
            position,
            permissions,
            timeload,
        };

        dispatch(createUser(newUser));

        setData(defaultFormData);
    }

    function handleChangePermissions(e: ChangeEvent<HTMLInputElement>, permission: string) {
        setData(prevState => ({
            ...prevState,
            permissions: e.target.checked
                ? [...prevState.permissions as string[], permission]
                : prevState.permissions?.filter((perm) => perm !== permission)
        }));
    }

    function handleChangePosition(e: ChangeEvent<HTMLSelectElement>) {
        const position = e.target.value;
        const {defaultPermissions} = positionsList.find(({name}) => name == position);

        setData(prevState => ({
            ...prevState,
            position,
            permissions: defaultPermissions
        }));
    }

    function setRandomPassword() {
        setData(prevState => ({...prevState, password: generatePassword()}));
    }

    return (
        <ModalForm
            title={isEditing ? "Edit member" : "New member"}
            titleIcon={<PiUser size="24px"/>}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            onSubmit={isEditing ? handleUpdate : handleAdd}
            submitBtnLoading={loading}
            submitBtnText={isEditing ? "Edit" : "Add"}
            triggerBtn={children}
        >
            <FormLabel display="flex" flexDirection="column" gap="1">
                <Text>Name</Text>
                <CustomInput
                    type="text"
                    onChange={(e) => handleChangeInput(e, "name")}
                    value={name}
                    required
                />
            </FormLabel>
            <FormLabel display="flex" flexDirection="column" gap="1">
                <Text>Surname</Text>
                <CustomInput
                    type="text"
                    onChange={(e) => handleChangeInput(e, "surname")}
                    value={surname}
                    required
                />
            </FormLabel>
            <FormLabel display="flex" flexDirection="column" gap="1">
                <Text>Email</Text>
                <CustomInput
                    type="email"
                    onChange={(e) => handleChangeInput(e, "email")}
                    value={email}
                    isDisabled={isEditing}
                    required
                />
            </FormLabel>
            <FormLabel display="flex" flexDirection="column" gap="1">
                <Text>Position</Text>
                <Select
                    variant="outline"
                    borderColor="gray.300"
                    focusBorderColor="gray.500"
                    onChange={handleChangePosition}
                    value={position}
                >
                    {
                        positionsList.map(position =>
                            <option key={position.name} value={position.name}>{position.description}</option>
                        )
                    }
                </Select>
            </FormLabel>
            {!isEditing && <Box position="relative">
                <FormLabel display="flex" flexDirection="column" gap="1">
                    <Text>Password</Text>
                    <InputGroup>
                        <CustomInput
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => handleChangeInput(e, "password")}
                            value={password}
                            required
                        />
                        <InputRightElement>
                            <Box w="24px" onClick={handleShowPassword}>
                                {showPassword ? (
                                    <BiHide size="24"/>
                                ) : (
                                    <BiShow size="24"/>
                                )}
                            </Box>
                        </InputRightElement>
                    </InputGroup>
                </FormLabel>
                <RandomPasswordButton setRandomPassword={setRandomPassword}/>
            </Box>}
            <FormLabel display="flex" flexDirection="column">
                <Text>Work time (%)</Text>
                <CustomSlider onChange={(value) => handleChangeValue(value, "timeload")} value={timeload}/>
            </FormLabel>
            <FormLabel m="0">
                <Text>Permissions</Text>
            </FormLabel>
            <List
                flexWrap="wrap"
                display="flex"
                gap="4"
                lineHeight="1"
                borderWidth="1px"
                p="3"
                rounded="md"
            >
                {permissionList.map((permission) =>
                    <PermissionItem
                        key={permission.name}
                        permission={permission}
                        permissions={permissions}
                        handlePermissions={handleChangePermissions}/>
                )}
            </List>
        </ModalForm>
    );
}

export default CreateEditMemberForm;