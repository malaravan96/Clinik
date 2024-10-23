"use client";

import React, { useState, forwardRef } from "react";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Snackbar,
  Alert,
  AlertColor,
  Container,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import ProviderDateComponent from "./time";
import dayjs from "dayjs";

interface AppointmentFormProps {
  providerId: string;
  providerName: string | null | any;
}

interface FormData {
  appointmentId: string;
  providerId: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  weekDay: string;
  status: string;
  type: string;
  insurance: string;
  reasonForVisit: string;
}
const AppointmentForm = React.forwardRef<{ submitForm: () => void }, AppointmentFormProps>(
  ({ providerId, providerName }, ref) => {
    const [formData, setFormData] = useState<FormData>({
      appointmentId: "",
      providerId: providerId,
      patientId: "",
      appointmentDate: "",
      appointmentTime: "",
      weekDay: "",
      status: "",
      type: "",
      insurance: "",
      reasonForVisit: "",
    });

    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Step for form navigation
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const statusOptions = ["Scheduled", "Completed", "Cancelled"];
    const [visitType, setVisitType] = useState<string>(""); // Fixed visitType state
    const [insurance, setInsurance] = useState<string>(""); // Fixed insurance state
    const [reason, setReason] = useState<string>(""); // Fixed reason state
    const [visitedBefore, setVisitedBefore] = useState<boolean>(false); // Fixed visitedBefore state

    const generateTimeSlots = () => {
      const slots = [];
      let start = 9;
      const end = 18;

      for (let hour = start; hour <= end; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const formattedHour = hour > 12 ? (hour - 12).toString().padStart(2, "0") : hour.toString().padStart(2, "0");
          const ampm = hour >= 12 ? "PM" : "AM";
          const formattedMinute = minute === 0 ? "00" : minute.toString().padStart(2, "0");
          slots.push(`${formattedHour}:${formattedMinute} ${ampm}`);
        }
      }

      return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
      setLoading(true);

      try {
        const response = await axios.post(
          "https://pyskedev.azurewebsites.net/api/ProvidersAppointment/CreateProvidersAppointment",
          formData
        );
        console.log("Appointment created:", response.data);
        setSnackbarMessage("Appointment created successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        resetForm();
      } catch (error) {
        console.error("Error creating appointment:", error);
        setSnackbarMessage("Error creating appointment. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    const resetForm = () => {
      setFormData({
        appointmentId: "",
        providerId: "",
        patientId: "",
        appointmentDate: "",
        appointmentTime: "",
        weekDay: "",
        status: "",
        type: "",
        insurance: "",
        reasonForVisit: "",
      });
      setSelectedTimeSlot(null);
    };

    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
    };


    const handleNext = () => {
      setStep(2); // Move to the summary step
    };

    const handleBack = () => {
      setStep(1); // Go back to the form step
    };

    const handleInsuranceChange = (event: SelectChangeEvent<string>) => {
      setFormData({ ...formData, insurance: event.target.value });
    };

    // Handlers for the new fields
    const handleVisitTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, type: e.target.value });
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setReason(e.target.value);
      setFormData({ ...formData, reasonForVisit: e.target.value });
    };

    const handleVisitedBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVisitedBefore(e.target.checked);
    };
    const handleDateTimeSelected = (date: Date, fromTime: string, toTime: string, selectedTimeSlot: string) => {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      setFormData(prevFormData => ({
        ...prevFormData,
        appointmentDate: formattedDate,
        appointmentTime: selectedTimeSlot // Store the selected time slot
      }))
    }

    return (
      <Container>
        <Card>
          {providerName}
          <CardContent>
            {step === 1 && (
              <Box sx={{ mt: 2 }}>

                

                <TextField
                  label="Weekday"
                  select
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="weekDay"
                  value={formData.weekDay}
                  onChange={handleInputChange}
                  required
                >
                  {weekDays.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Status"
                  select
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
                <ProviderDateComponent onDateTimeSelected={handleDateTimeSelected} providerId={providerId} />

                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Set type of visit</FormLabel>
                  <RadioGroup value={formData.type} onChange={handleVisitTypeChange}>
                    <FormControlLabel value="Video call" control={<Radio />} label="Video call" />
                    <FormControlLabel value="Hospital Visit" control={<Radio />} label="Hospital Visit" />
                  </RadioGroup>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="insurance-label">Do You Have Insurance?</InputLabel>
                  <Select
                    labelId="insurance-label"
                    id="insurance-select"
                    value={formData.insurance}
                    label="Do You Have Insurance?" // This works with InputLabel
                    onChange={handleInsuranceChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>


                <TextField
                  label="Reason For Visit"
                  placeholder="Reason For Visit"
                  multiline
                  rows={3}
                  fullWidth
                  margin="normal"
                  name="reasonForVisit"
                  value={reason}
                  onChange={handleReasonChange}
                  required
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visitedBefore}
                      onChange={handleVisitedBeforeChange}
                    />
                  }
                  label="Have you visited us before?"
                />
              </Box>
            )}

            {step === 2 && (
              <Box sx={{ mt: 2 }}>
                {/* Summary of the form */}
                <Typography variant="h6">Summary</Typography>

                <Typography>
                  <strong>Appointment Date:</strong> {formData.appointmentDate}
                </Typography>
                <Typography>
                  <strong>Appointment Time:</strong> {formData.appointmentTime}
                </Typography>
                <Typography>
                  <strong>Weekday:</strong> {formData.weekDay}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {formData.status}
                </Typography>
                <Typography>
                  <strong>Visit Type:</strong> {formData.type}
                </Typography>
                <Typography>
                  <strong>Insurance:</strong> {formData.insurance}
                </Typography>
                <Typography>
                  <strong>Reason for Visit:</strong> {formData.reasonForVisit}
                </Typography>
                <Typography>
                  <strong>Visited Before:</strong> {visitedBefore ? "Yes" : "No"}
                </Typography>
              </Box>
            )}
          </CardContent>
          <CardActions>
            {step === 1 && (
              <Button variant="contained" onClick={handleNext} disabled={loading}>
                Next
              </Button>
            )}
            {step === 2 && (
              <Button variant="contained" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || step === 1}
            >
              Submit
            </Button>
            {loading && <CircularProgress />}
          </CardActions>
        </Card>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    );
  });

export default AppointmentForm;
