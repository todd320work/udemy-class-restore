import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../App/api/agent"

export default function AboutPage()
{
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError(){
        agent.TestErrors.getValidationError()
        .then(() => console.log('should not see this...'))
        .catch( error => setValidationErrors(error));
    }
    return ( 
        <Container>
            <Typography variant='h2'>About Page!!</Typography>
            <ButtonGroup fullWidth>
                <Button variant='contained' onClick={() => agent.TestErrors.get400Error().catch( error => console.log(error))}>test 400</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get401Error().catch( error => console.log(error))}>test 401</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get404Error().catch( error => console.log(error))}>test 404</Button>
                <Button variant='contained' onClick={() => agent.TestErrors.get500Error().catch( error => console.log(error))}>test 500</Button>
                <Button variant='contained' onClick={getValidationError}>test valid</Button>
            </ButtonGroup>
            {validationErrors.length > 0  && 
                <Alert severity='error'>
                    <AlertTitle> Validation Errors</AlertTitle>
                        <List>
                            {validationErrors.map(error => (
                                <ListItem key={error}>
                                    <ListItemText>{error}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                </Alert>
            }
        </Container>
    )
}