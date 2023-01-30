import { TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { useAppSelector } from "../../App/store/configureStore";

export default function BasketSummary() {
    const {basket} = useAppSelector( state => state.basket);

    const subTemp = basket?.items.reduce( (sum, item) => sum + (item.product.price * item.quantity), 0 );
    var deliveryFee = 0;
    var subTotal = 0;
    if( subTemp !== undefined)
    {
        subTotal = subTemp;
        if( subTotal < 10000 && subTotal > 0 ) deliveryFee = 999;
    }

    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{(subTotal/100).toFixed(2).toString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{(deliveryFee/100).toFixed(2).toString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{((subTotal + deliveryFee)/100).toFixed(2).toString()}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}