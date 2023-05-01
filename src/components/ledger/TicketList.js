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
    const handleCollapse = () => {
        setDisplayedData(tickets.slice(0, 5));
        setPage(1);
        setCollapsed(false);
    };

    const filteredTickets = displayedData.filter((ticket) => ticket._id !== props.activeTicket?._id);

    const mappedSeperateTickets = (
        <div>
            {displayedData.map((ticket) => (
                <li className='ticket'>
                    <Button
                        onClick={() => {
                            props.setActiveTicket(ticket);
                            props.toggleTicketInfoModal();
                        }}
                    >
                        {ticket.billTo} - {ticket.date} - Ticket #{ticket.ticketNum ? ticket.ticketNum : '-----'}
                    </Button>
                </li>
            ))}
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
        <div key={props.worker}>
            <h2>{props.worker}'s Job Tickets</h2>
            <ul>{mappedSeperateTickets}</ul>
        </div>
    );
};

export default TicketList;