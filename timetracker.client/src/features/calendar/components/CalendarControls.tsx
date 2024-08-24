import { useContext } from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { Button, Heading, HStack } from "@chakra-ui/react";

import dateConverter from "@utils/formatters.ts";
import { CalendarContext } from "@features/calendar/context/calendarContext.tsx";
import { CalendarContextType } from "@features/calendar/types/calendar.ts";

function CalendarControls() {
    const { currentDate, setCurrentDate } = useContext(CalendarContext) as CalendarContextType;
    const formattedDate = dateConverter(currentDate, "MMMM yyyy");

    function prevMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }

    function nextMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }

    return (
        <HStack flex="0 0 auto">
            <Button onClick={prevMonth}><PiCaretLeftBold size="24"/></Button>
            <Heading w={170} textAlign="center" size="md">{formattedDate}</Heading>
            <Button onClick={nextMonth}><PiCaretRightBold size="24"/></Button>
        </HStack>
    );
}

export default CalendarControls;
