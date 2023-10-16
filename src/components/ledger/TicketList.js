import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { useWorkerContext } from "../../hooks/useWorkerContext";

const TicketList = (props) => {
    const { API_URL, workerlist } = useWorkerContext()
    const { getData, data: tickets, error, loading } = useDataFetcher();
    const [page, setPage] = useState(1);
    const [displayedData, setDisplayedData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        getData(`${API_URL}ticket/workerList/${props.worker}`);
    }, []);

    useEffect(() => {
        if (tickets.length > 0) {
            setDisplayedData(tickets.slice(0, 5));
        }
    }, [tickets]);

    const handleLoadMore = () => {
        const nextChunk = tickets.slice(page * 5, (page + 1) * 5);
        setDisplayedData([...displayedData, ...nextChunk]);
        setPage(page + 1);
    };

    const scrollToBot = () => {
        let scrollPostion = document.body.scrollHeight + 100
        window.scrollTo({
            top: scrollPostion,
            behavior: "smooth",
        });
    };

    const handleCollapse = () => {
        setDisplayedData(tickets.slice(0, 5));
        setPage(1);
        setCollapsed(false);
    };

    // if the user doesnt have any tickets stored they are omitted
    if (displayedData.length === 0) {
        return null;
    }

    const filteredTickets = displayedData.filter(
        (ticket) =>
            ticket.billTo.toLowerCase().includes(props.searchVal.toLowerCase()) ||
            (ticket.ticketNum && String(ticket.ticketNum).includes(props.searchVal))
    );

    const mappedSeperateTickets = (
        <div>
            {filteredTickets.map((ticket, i) => {
                return (
                    <li key={i} className='ticket'>
                        <Button
                            disabled={props.editMode}
                            onClick={() => {
                                props.setActiveTicket(ticket);
                                scrollToBot()
                            }}
                        >
                            {`${ticket.billTo} - ${ticket.date} - Ticket #${ticket.ticketNum ? ticket.ticketNum : '-----'}`}
                        </Button>
                    </li>
                );
            })}
            {!collapsed && displayedData.length < tickets.length && (
                <Button color="warning" onClick={handleLoadMore}>
                    {tickets.length - displayedData.length >= 5
                        ? 'Load next 5'
                        : `Load last ${tickets.length - displayedData.length}`}
                </Button>
            )}
            {displayedData.length >= 5 && !collapsed && displayedData.length === tickets.length && (
                <Button color="warning" onClick={handleCollapse}>Collapse</Button>
            )}
        </div>
    );

    return (
        <div style={{ display: filteredTickets.length === 0 ? 'none' : '' }} key={props.worker}>
            <h2>{props.worker}'s Job Tickets</h2>
            <ul>{mappedSeperateTickets}</ul>
        </div>
    );

};

export default TicketList;