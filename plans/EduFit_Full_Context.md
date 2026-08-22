# EduFit Nepal - Full Project Context Document

## Purpose of this document

This document contains the complete context for another developer, AI
assistant, or team member who needs to continue the EduFit Nepal project
without the previous conversation.

It includes: - MVP requirements - Product vision - Architecture
decisions - Research background - AI strategy - Student access layer -
Future expansion ideas - Hackathon presentation guidance

------------------------------------------------------------------------

# Project Name

## EduFit Nepal

## One-line pitch

EduFit helps schools avoid failed EdTech investments by analyzing their
environment, student accessibility, and readiness before recommending
educational technologies and implementation strategies.

------------------------------------------------------------------------

# Core Problem

Many schools adopt educational technology because it is popular or
because other institutions use it.

However, EdTech adoption often fails because:

-   Students do not have equal access to devices
-   Internet connectivity is insufficient
-   Teachers are not prepared
-   The selected technology does not match the school's environment
-   Resources do not align with curriculum or learning goals

The problem is not only lack of technology.

The problem is choosing and implementing the wrong technology.

------------------------------------------------------------------------

# Research Foundation

EduFit is inspired by the idea behind EdTech readiness frameworks.

The World Bank's Education and Technology Readiness Index (ETRI)
evaluates factors needed for effective EdTech adoption:

1.  School Management
2.  Teachers
3.  Students
4.  Devices
5.  Connectivity
6.  Digital Education Resources

Source: World Bank EdTech Readiness Index:
https://www.worldbank.org/en/topic/education/brief/edtech-readiness-index

The important idea:

A school being equipped with devices or internet alone does not
guarantee successful learning outcomes.

Successful EdTech requires the complete ecosystem.

------------------------------------------------------------------------

# Product Vision

EduFit is not:

-   An AI tutor
-   A learning management system
-   A content marketplace

EduFit is:

A decision intelligence platform for educational technology adoption.

It answers:

"Will this EdTech solution actually work in this school's reality?"

------------------------------------------------------------------------

# System Overview

                     EduFit Nepal

              ---------------------
              |                   |
       School Web App       Student Mobile App
              |                   |
              |                   |
              --------- Sync ------
                        |
                        |
              Compatibility Engine
                        |
                        |
              Recommendations
                        |
                        |
                  AI Advisor

------------------------------------------------------------------------

# Version 1: EduFit Core (MVP)

## Goal

Build a working EdTech compatibility engine.

The system should:

1.  Collect school information
2.  Collect student accessibility information
3.  Calculate readiness scores
4.  Match schools with suitable EdTech solutions
5.  Explain recommendations

------------------------------------------------------------------------

# School / Teacher Web Application

## User Types

-   Principal
-   Teacher
-   Education organization

------------------------------------------------------------------------

# School Profile

Information collected:

-   School name
-   Location
-   School type
-   Student count
-   Grade levels
-   Number of teachers
-   Current technology usage

------------------------------------------------------------------------

# Digital Readiness Assessment

## 1. Infrastructure

Measures:

-   Number of devices
-   Student/device ratio
-   Device availability
-   Internet quality
-   Technical support

------------------------------------------------------------------------

## 2. Teacher Readiness

Measures:

-   Teacher digital skills
-   Previous technology usage
-   Training availability
-   Confidence using technology

------------------------------------------------------------------------

## 3. School Management

Measures:

-   Technology strategy
-   Leadership support
-   Budget planning
-   Implementation readiness

------------------------------------------------------------------------

## 4. Learning Requirements

Measures:

-   Subject
-   Grade
-   Learning goals
-   Current challenges

------------------------------------------------------------------------

# EdTech Database

Each EdTech tool has a profile.

Example:

## AI Tutor

Requirements:

-   High internet availability
-   High device access
-   Teacher monitoring

Best for:

-   Personalized practice

------------------------------------------------------------------------

## Offline Learning Platform

Requirements:

-   Lower connectivity
-   Shared devices
-   Teacher involvement

Best for:

-   Low-resource environments

------------------------------------------------------------------------

# Compatibility Engine

Important:

The scoring engine should NOT rely on AI.

Use transparent rules.

Example:

Input:

School: - Low device availability - Medium teacher readiness - Poor
internet

Tool: - Requires many devices - Requires stable internet

Output:

    Compatibility Score: 45%

    Problems:
    - Device shortage
    - Internet requirement too high

    Recommendation:
    Start with offline or classroom-based tools.

Transparency is important because schools should understand why a
recommendation was made.

------------------------------------------------------------------------

# Student Access Layer

## Purpose

School information is incomplete.

A school may report:

"We have 100 computers."

But students may report:

"Only 20% can access digital learning outside school."

The student layer provides reality data.

------------------------------------------------------------------------

# Student Mobile Application

Technology:

Capacitor wrapper around web application.

------------------------------------------------------------------------

# Student Features

## Student Account

Possible authentication:

-   School code
-   Student ID
-   School email (future)

------------------------------------------------------------------------

## Student Digital Access Survey

Collect:

-   Device ownership
-   Internet availability
-   Learning preferences
-   Digital confidence
-   Access limitations

Example:

    Do you have a device at home?

    Laptop
    Phone
    Shared device
    No device


    Internet access:

    Always
    Sometimes
    Never

------------------------------------------------------------------------

## Student Resource Hub

Purpose:

Provide useful educational resources.

Features:

-   School-approved learning resources
-   Scholarship information
-   Competition information
-   Digital learning materials

Avoid turning this into a generic discount marketplace.

------------------------------------------------------------------------

# Student Data Impact

Example:

School data:

    Devices:
    100

Student reality:

    Personal device access:
    35%

    Home internet:
    40%

System updates recommendation:

    Avoid homework-only online platforms.

    Recommended:
    Classroom-based digital learning.

------------------------------------------------------------------------

# Version 2: EduFit AI Advisor

The AI layer enhances the system.

Important:

The LLM does NOT calculate scores.

The engine calculates.

The LLM explains.

------------------------------------------------------------------------

# AI Architecture

    School Data
    +
    Student Data
    +
    Research Rules Engine

            |

    Compatibility Result

            |

    LLM Explanation Layer

            |

    Action Plan

------------------------------------------------------------------------

# AI Features

## 1. Implementation Planner

Example:

Input:

    Readiness:
    58/100

    Problems:
    - Low devices
    - Teacher training gap

Output:

    90-day plan:

    Month 1:
    Teacher training

    Month 2:
    Small classroom pilot

    Month 3:
    Evaluate results

------------------------------------------------------------------------

## 2. AI Report Generator

Creates reports for:

-   Schools
-   NGOs
-   Municipalities

Example:

    EdTech Adoption Report

    Current readiness:
    72%

    Main limitation:
    Student device access

    Recommended investment:
    Teacher training

------------------------------------------------------------------------

## 3. AI Policy Assistant (Future)

For organizations managing many schools:

Example:

    School A:
    Needs devices

    School B:
    Needs teacher training

    School C:
    Ready for advanced EdTech

------------------------------------------------------------------------

# Offline Strategy

Do not market as offline-only.

Use:

Offline-capable / offline-first.

Meaning:

Core assessment can work locally.

Synchronization happens when internet is available.

Possible technologies:

-   PWA
-   IndexedDB
-   Local storage
-   Background synchronization

Offline benefits:

-   Useful for schools with unreliable connectivity
-   Allows assessments without constant internet

------------------------------------------------------------------------

# Technology Stack

Possible stack:

Frontend: - React - Next.js

Mobile: - Capacitor

Backend: - Node.js - FastAPI

Database: - PostgreSQL - SQLite

AI: - LLM API or local model

------------------------------------------------------------------------

# Hackathon MVP Priority

Build in this order:

1.  School assessment dashboard
2.  Compatibility scoring engine
3.  Student mobile survey
4.  Recommendation screen
5.  AI explanation feature

------------------------------------------------------------------------

# Do Not Build

Avoid:

-   Full AI tutor
-   Complete LMS
-   Huge education marketplace
-   Complex social network

These distract from the unique value.

------------------------------------------------------------------------

# Demo Flow

1.  Teacher creates school profile
2.  School completes readiness assessment
3.  Student logs into mobile app
4.  Students complete access survey
5.  Dashboard updates with real accessibility data
6.  System recommends suitable EdTech
7.  AI creates implementation roadmap

------------------------------------------------------------------------

# Hackathon Pitch

"EduFit prevents failed EdTech investments by connecting school reality
with technology decisions. It combines school readiness analysis and
student accessibility data to recommend technology that can actually
succeed."

------------------------------------------------------------------------

# Long-Term Expansion

## Government Dashboard

Analyze many schools.

## Verified EdTech Database

Companies submit requirements and compatibility information.

## AI Education Consultant

Generate deployment strategies and improvement plans.

## NGO Support Tool

Help organizations decide where education technology investment is most
needed.

------------------------------------------------------------------------

# Key Product Principle

EduFit is not trying to replace educators.

It helps educators and organizations make better technology decisions.
