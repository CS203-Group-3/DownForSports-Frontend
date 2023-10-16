package com.example.cs203g1t3.models;

import java.time.LocalDate;
import java.time.LocalTime;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "booking")
@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Booking {

    @Id
    @GeneratedValue (strategy =  GenerationType.IDENTITY)
    private Long bookingId;

    @Column(columnDefinition = "TIME")
    private LocalTime startTime;
    @Column(columnDefinition = "TIME")
    private LocalTime endTime;

    private LocalDate dateCreated;
    

    @ManyToOne
    @JoinColumn(name = "facility_id")
    private Facility facility;



}
    //BookingStatus
    // private BookingStatus bookingStatus;
    