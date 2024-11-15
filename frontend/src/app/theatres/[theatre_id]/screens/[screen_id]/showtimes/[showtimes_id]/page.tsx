"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

export default function BookPage(
    {
        params
    }:
    {
        params:{
            theatre_id:string,
            screen_id:string,
            showtimes_id: string
        }
    }
){
    const [showtimeDetails, setShowtimeDetails] = useState<any>();
    const [ screenData, setScreenData ] = useState<any>();
    const [ seatData, setSeatData ] = useState<any[]>([]);
    const [rowNumber, setRowNumber] = useState<number>();
    const [maxColumns, setMaxColumns] = useState<number>()
    const [seats, setSeats] = useState<any[]>([])
    const [bookingIds, setBookingIds] = useState<any[]>();
    const [pricing, setPricing] = useState<any>([]);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]); 
    const [totalCost, setTotalCost] = useState<number>(0);
    const [isProcessing, setProcessing] = useState<boolean>(false)
    const [trigger, setTrigger] = useState<boolean>(false);
    
    useEffect(()=>{

        const fetchBookingsData = async() => {
            const response = await fetch(`/api/bookings/showtimes/${params.showtimes_id}/seats`)
            const data = await response.json();
            console.log(data)
            setBookingIds(data)
        }

        const fetchPricingDetails = async() => {
            const response = await fetch(`/api/theatres/${params.theatre_id}/screens/${params.screen_id}/showtimes/${params.showtimes_id}/pricings`)
            const data = await response.json();
            console.log(data)
            setPricing(data);
        }

        const fetchShowtimeDetails = async()=>{
            const response = await fetch(`/api/theatres/${params.theatre_id}/screens/${params.screen_id}/showtimes/${params.showtimes_id}`);
            const data = await response.json();
            console.log(data)
            setShowtimeDetails(data);
        }

        const fetchScreenData = async() => {
            const ScreenSeatDataResponse = await fetch(`/api/theatres/${params.theatre_id}/screens/${params.screen_id}`)
            const ScreenSeatData = await ScreenSeatDataResponse.json();
            setScreenData(ScreenSeatData.screen_data);
            setSeatData(ScreenSeatData.seat_data)
            setRowNumber(ScreenSeatData.screen_data.no_of_rows)
            setMaxColumns(ScreenSeatData.screen_data.max_row_seats)
        }


        fetchBookingsData()
        fetchPricingDetails()
        fetchShowtimeDetails()
        fetchScreenData()

    },[])

    async function handleBookSeats() {
        try {
            setProcessing(true);
    
            const response = await fetch(`/api/bookings/showtimes/${params.showtimes_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    seat_ids: selectedSeatIds  // Send the selected seat IDs
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to book seats:", errorData.error);
                return;
            }
    
            const result = await response.json();
            console.log("Seats booked successfully:", result);
            alert("Seats booked successfully")
            window.location.href = `/theatres/${params.theatre_id}/showtimes`
            // You can also update the UI here to reflect the successful booking
    
        } catch (error) {
            console.error("Error booking seats:", error);
        } finally {
            setProcessing(false);
        }
    }
    

    useEffect(() => {
        if (bookingIds && bookingIds.length > 0 && seats.length > 0 && trigger) {
            const updatedSeats = seats.map(row => row.map((seat:any) => {
                if (bookingIds.some(booking => booking.seat_id === seat.seat_id)) {
                    return { ...seat, state: "booked" };
                }
                return seat;
            }));
            setSeats(updatedSeats);
        }
    }, [bookingIds, trigger]);

    useEffect(() => {
        const generateSeatsAsync = async () => {
            await generateSeats();
         };
      
         generateSeatsAsync();
      }, [rowNumber, maxColumns, seatData]);


    const generateSeats = async() => {
        if (rowNumber && maxColumns) {
          const generatedSeats = [];
          for (let i = 0; i < rowNumber; i++) {
            const row = [];
            for (let j = 0; j < maxColumns; j++) {
              row.push({ row: i + 1, seat: j + 1, type: "Standard", state: "inactive", seat_id:null });
            }
            generatedSeats.push(row);
          }

          console.log("GENERATED SEATS",generatedSeats)
      
          // Update with seatData
          if (seatData.length > 0) {
            const updatedSeats = generatedSeats.map(row => [...row]); // Deep copy of generatedSeats
            seatData.forEach(seatRow => {
                seatRow.forEach(seat => {
                    const { row_num, seat_number, seat_type_name, seat_id } = seat;
                    // console.log(seat)
                    if (updatedSeats[row_num - 1] && updatedSeats[row_num - 1][seat_number - 1]) {
                        updatedSeats[row_num - 1][seat_number - 1].state = "active";
                        updatedSeats[row_num - 1][seat_number - 1].type = seat_type_name;
                        updatedSeats[row_num - 1][seat_number - 1].seat_id = seat_id;
                        
                    }
                })
              
            });

            const response = await fetch(`/api/bookings/showtimes/${params.showtimes_id}/seats`)
            const data = await response.json();
            console.log(data)

            setBookingIds(data)

            if (data && data.length > 0 && updatedSeats.length > 0) {
                const updatedSeatsNew = updatedSeats.map(row => row.map((seat:any) => {
                    if (data.some(booking => booking === seat.seat_id)) {
                        return { ...seat, state: "booked" };
                    }
                    return seat;
                }));
                setSeats(updatedSeatsNew);
            }
            else{
                setSeats(updatedSeats)
            }


            
          }
        }
      };

      const handleSeatClick = (seat: any) => {
        if (seat.seat_id) {
            if (seat.state === "booked") return; // Do nothing if the seat is already booked
            else if (seat.state === "inactive") return; // Ignore inactive seats
    
            setSelectedSeatIds((prevSelectedSeatIds) => {
                const isSelected = prevSelectedSeatIds.includes(seat.seat_id);
                const newSelectedSeats = isSelected
                    ? prevSelectedSeatIds.filter((id) => id !== seat.seat_id) // Deselect
                    : [...prevSelectedSeatIds, seat.seat_id]; // Select
    
                const newTotalCost = newSelectedSeats.reduce((acc, seatId) => {
                    const selectedSeat = seats.flat().find((seat) => seat.seat_id === seatId);
                    return acc + getSeatPrice(selectedSeat?.type);
                }, 0);
    
                setTotalCost(newTotalCost); // Update the total cost
                return newSelectedSeats;
            });
    
            // Update the seat state (active <-> selected)
            const updatedSeats = seats.map(row =>
                row.map((s: any) => {
                    if (s.seat_id === seat.seat_id) {
                        return { ...s, state: s.state === "selected" ? "active" : "selected" };
                    }
                    return s;
                })
            );
            setSeats(updatedSeats);
        }
    };
    

    const getSeatPrice = (seatType: string): number => {
        const seatPricing = pricing.find(
          (item:any) => item.seat_type_name === seatType
        );
        return seatPricing ? parseFloat(seatPricing.price) : 0;
      };
    
      useEffect(() => {
        if (seats && seats.length > 0) {
          const updatedSeats = seats.map((row) =>
            row.map((seat: any) => {
              if (selectedSeatIds.includes(seat.seat_id)) {
                return { ...seat, state: "selected" };
              }
              return seat;
            })
          );
          setSeats(updatedSeats);
          console.log(selectedSeatIds)
        }
      }, [selectedSeatIds]);

      function getSeatColor(seat_type:string, seat_state:string):string {
        if(seat_state=="inactive") return "bg-white";
        else if(seat_state=="booked") return "bg-black";
        else if (seat_state == "selected") return "bg-green-400";
        switch(seat_type){
            case "Standard":
                return "bg-white"
            case "Recliner":
                return "bg-orange-500"
            case "Premium":
                return "bg-red-500"
            case "VIP":
                return "bg-blue-300"
            default:
                return "bg-gray-200"
        }
    }

    return (
        <>
            <div className="relative">
            <div className="w-full min-h-full pt-2 gap-2" style={{ minHeight: "calc(100vh - 5rem)" }}>
            {showtimeDetails && 
                <div className="flex flex-col gap-3 p-5 w-[40%] m-auto border shadow-xl mt-5 mb-20 rounded-2xl">
                    <div className="text-lg font-normal">Theatre Name: <span className="font-semibold">{showtimeDetails.theatre_name}</span></div>

                    <div className="text-lg font-normal">Theatre Location: <span className="font-semibold">{showtimeDetails.theatre_location}</span></div>

                    <div className="text-lg font-normal">Screen Name: <span className="font-semibold">{showtimeDetails.screen_name}</span></div>

                    <div className="text-lg font-normal">Movie Name: <span className="font-semibold">{showtimeDetails.movie_title}</span></div>

                    <div className="text-lg font-normal">Director Name: <span className="font-semibold">{showtimeDetails.movie_director_name}</span></div>
                    
                    <div className="text-lg font-normal">Timings: <span className="font-semibold">{new Date(showtimeDetails.showtime_start_time).toLocaleString()} - {new Date(showtimeDetails.showtime_end_time).toLocaleString()}</span></div>
                    
                </div>
            }

            <div className="w-[70%] m-auto mt-10 p-4">
                    {/* Render Seats Here */}
                    {seats && seats.length > 0 && (
                        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maxColumns}, 1fr)` }}>
                            {seats.map((row, rowIndex) => (
                                row.map((seat, seatIndex) => (
                                    <div key={`${rowIndex}-${seatIndex}`} className="h-10 flex justify-center items-center">
                                        <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                        <Button variant="link" onClick={() => handleSeatClick(seat)} size="icon" className={getSeatColor(seat.type, seat.state)} disabled={seat.state === "booked"}>
                                            <svg fill={seat.state=="active"?"#000000":"#FFFFFF"} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g transform="translate(1 1)"> <g> <g> <path d="M442.733,204.653h-57.398l-7.455-135.68C376.173,29.72,343.747-1,304.493-1h-98.987 c-39.253,0-70.827,30.72-73.387,69.973L124.685,203.8H67.267c-9.387,0-17.067,7.68-17.067,17.067v17.067 C50.2,247.32,57.88,255,67.267,255v93.867c0,14.507,11.093,25.6,25.6,25.6h8.533V383c0,5.12,3.413,8.533,8.533,8.533h25.6V485.4 c0,14.507,11.093,25.6,25.6,25.6c14.507,0,25.6-11.093,25.6-25.6v-93.867h136.533V485.4c0,14.507,11.093,25.6,25.6,25.6 c14.507,0,25.6-11.093,25.6-25.6v-93.867h25.6c5.12,0,8.533-3.413,8.533-8.533v-8.533h8.533c14.507,0,25.6-11.093,25.6-24.747 V255c9.387,0,17.067-7.68,17.067-16.213V221.72C459.8,212.333,452.12,204.653,442.733,204.653z M205.507,16.067h98.987 c29.867,0,54.613,23.893,56.32,53.76l9.538,175.779c-0.099,0.531-0.152,1.097-0.152,1.715l2.07,33.644l0.472,8.695 c-0.578-0.089-1.161-0.161-1.747-0.228c-1.496-0.29-3.276-0.297-5.062-0.297H144.067c-1.786,0-3.566,0.007-5.062,0.297 c-0.586,0.067-1.169,0.139-1.747,0.228l2.278-41.984c0.102-0.392,0.195-0.792,0.264-1.207l1.707-34.133 c0-0.147-0.015-0.308-0.028-0.467l7.708-142.04C150.893,39.96,175.64,16.067,205.507,16.067z M67.267,220.867h56.32 l-0.853,17.067H75.8h-8.533V220.867z M92.867,357.4c-5.12,0-8.533-3.413-8.533-8.533V255h37.528l-0.171,3.097l-2.37,38.716 c-0.153,0.118-0.296,0.245-0.448,0.364c-10.648,7.692-17.472,20.224-17.472,34.623v25.6H92.867z M169.667,485.4 c0,5.12-3.413,8.533-8.533,8.533s-8.533-3.413-8.533-8.533v-93.867h17.067V485.4z M357.4,485.4c0,5.12-3.413,8.533-8.533,8.533 c-5.12,0-8.533-3.413-8.533-8.533v-93.867H357.4V485.4z M391.533,374.467h-25.6H331.8H178.2h-34.133h-25.6v-8.533V331.8 c0-0.571,0.021-1.14,0.058-1.704c0.002-0.035,0.005-0.069,0.007-0.104c0.383-5.449,2.487-10.538,5.776-14.762 c1.576-1.895,3.43-3.544,5.508-4.897c0.711-0.113,1.506-0.321,2.305-0.721c2.064-1.548,4.442-2.464,6.94-2.953 c0.269-0.05,0.539-0.096,0.81-0.138c0.131-0.021,0.263-0.04,0.395-0.058c0.345-0.048,0.692-0.091,1.042-0.126 c0.122-0.012,0.244-0.02,0.367-0.03c0.325-0.028,0.65-0.054,0.979-0.071c0.47-0.022,0.942-0.037,1.413-0.037h221.867 c0.472,0,0.943,0.015,1.413,0.037c0.329,0.017,0.654,0.043,0.979,0.071c0.122,0.01,0.245,0.019,0.367,0.03 c0.35,0.035,0.697,0.078,1.042,0.126c0.132,0.018,0.264,0.038,0.395,0.058c0.272,0.042,0.542,0.089,0.81,0.138 c2.499,0.489,4.877,1.405,6.94,2.953c0.352,0.234,0.722,0.43,1.101,0.6c7.337,4.134,11.907,11.53,12.488,19.788 c0.002,0.03,0.005,0.06,0.006,0.09c0.038,0.566,0.058,1.136,0.058,1.709v34.133V374.467z M425.667,348.867 c0,5.12-3.413,8.533-8.533,8.533H408.6v-25.6c0-0.829-0.028-1.651-0.073-2.468c-0.017-0.311-0.045-0.618-0.068-0.927 c-0.037-0.487-0.077-0.973-0.129-1.455c-0.043-0.403-0.095-0.804-0.149-1.204c-0.048-0.348-0.099-0.694-0.155-1.039 c-0.078-0.493-0.162-0.983-0.256-1.47c-0.029-0.149-0.063-0.296-0.094-0.444c-2.199-10.719-8.268-19.938-16.996-25.98L388.12,255 h37.547V348.867z M442.733,237.933h-55.467l-0.853-17.067h56.32V237.933z"></path> <path d="M173.933,79.213c5.12,0.853,9.387-2.56,9.387-7.68c0.853-11.947,10.24-21.333,22.187-21.333h98.987 c11.947,0,21.333,9.387,22.187,21.333c0,4.267,4.267,7.68,8.533,7.68c5.12,0,8.533-4.267,8.533-8.533 c-0.853-21.333-17.92-37.547-39.253-37.547h-98.987c-20.48,0-38.4,16.213-39.253,36.693 C165.4,74.947,168.813,79.213,173.933,79.213z"></path> </g> </g> </g> </g></svg>
                                        </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className={seat.state=="inactive"?"hidden":""}>
                                        <div>{seat.type}</div>
                                        <div>₹{getSeatPrice(seat.type)}</div>
                                        </TooltipContent>
                                        </Tooltip>
                                        </TooltipProvider>
                                        
                                    </div>
                                ))
                            ))}
                        </div>
                    )}
                </div>
                <div className="border border-black w-[40%] m-auto p-3 mb-5"></div>

                <div className="w-[40%] m-auto p-3 mb-5 border flex flex-row-reverse justify-around">
                    <div>Total Cost: ₹{totalCost}</div>
                    <Button disabled={isProcessing} onClick={(e)=>handleBookSeats()}>Book Seats</Button>
                </div>
            </div>
            </div>
        </>
    )
}