import { logger } from '@services/logService';
import { PrismaClient, VirtualClassroomStudent } from '@prisma/client';
import { VirtualClassroomDAO } from '@dao/virtualClassroomDAO';
import { VirtualClassroom } from '@prisma/client';
import VirtualClassroomStudentDAO from '@dao/virtualClassroomStudentDAO';
import { VirtualClassroomParams } from 'types/express';

export interface CreateVirtualClassroomParams {
  name: string;
  facultyId: string;
  syllabusUrl: string | undefined;
  sectionId: string;
}
export class VirtualClassroomService {
  // should be created by faculty
  async createVirtualClassroom(data: CreateVirtualClassroomParams): Promise<VirtualClassroom> {
    logger.info('[VirtualClassroomService] : Creating virtual classroom with data:', data);
    try {
      const virtualClassroom = await VirtualClassroomDAO.create(data);
      return virtualClassroom;
    } catch (error) {
      logger.error('Error creating virtual classroom:', error);
      throw error;
    }
  }

  async getVirtualClassroom(filter: any): Promise<VirtualClassroom | null> {
    logger.info('[VirtualClassroomService] :Fetching virtual classroom with filter:', filter);
    try {
      const virtualClassroom = await VirtualClassroomDAO.get(filter);
      return virtualClassroom;
    } catch (error) {
      logger.error('Error fetching virtual classroom:', error);
      throw error;
    }
  }

  async getAllVirtualClassrooms(filter: any, includeFields: any): Promise<VirtualClassroom[]> {
    logger.info('[VirtualClassroomService] :Fetching all virtual classrooms with filter:', filter);
    try {
      const virtualClassrooms = await VirtualClassroomDAO.getAll({ filter, include: includeFields });
      return virtualClassrooms;
    } catch (error) {
      logger.error('Error fetching all virtual classrooms:', error);
      throw error;
    }
  }

  async updateVirtualClassroom(classroomId: string, data: Partial<VirtualClassroom>): Promise<VirtualClassroom> {
    logger.info('[VirtualClassroomService] :Updating virtual classroom with id:', classroomId, 'and data:', data);
    try {
      const virtualClassroom = await VirtualClassroomDAO.update(classroomId, data);
      return virtualClassroom;
    } catch (error) {
      logger.error('Error updating virtual classroom:', error);
      throw error;
    }
  }

  async deleteVirtualClassroom(classroomId: string): Promise<VirtualClassroom> {
    logger.info('[VirtualClassroomService] :Deleting virtual classroom with id:', classroomId);
    try {
      const virtualClassroom = await VirtualClassroomDAO.delete(classroomId);
      return virtualClassroom;
    } catch (error) {
      logger.error('Error deleting virtual classroom:', error);
      throw error;
    }
  }

  async getVirtualClassroomById(classroomId: string): Promise<VirtualClassroom | null> {
    logger.info('[VirtualClassroomService] :Fetching virtual classroom by id:', classroomId);
    try {
      const virtualClassroom = await VirtualClassroomDAO.get({ id: classroomId });
      return virtualClassroom;
    } catch (error) {
      logger.error('Error fetching virtual classroom by id:', error);
      throw error;
    }
  }

  async joinClassroom(studentId: string, classroomId: string): Promise<void> {
    logger.info(
      `[VirtualClassroomService] : Joining virtual classroom with id: ${classroomId} for student with id: ${studentId}`
    );
    try {
      const virtualClassroom = await VirtualClassroomDAO.join(classroomId, studentId);
      logger.info('Student joined virtual classroom:', virtualClassroom);
      return;
    } catch (error) {
      logger.error('Error joining virtual classroom:', error);
      throw error;
    }
  }

  async leaveClassroom(studentId: string, classroomId: string) {
    logger.info('[VirtualClassroomService] :Leaving virtual classroom with id:', classroomId);
    try {
      const student = await VirtualClassroomStudentDAO.leave(classroomId, studentId);
      return student;
    } catch (error) {
      logger.error('Error leaving virtual classroom:', error);
      throw new Error('Error while leaving the virtual classroom');
    }
  }

  async isStudentEnrolled(studentId: string, classroomId: string): Promise<Boolean> {
    try {
      const student = await VirtualClassroomStudentDAO.get({ studentId, classroomId });
      logger.info(`[VirtualClassroomService] : Checking if student is enrolled:${student}`);
      return student ? true : false;
    } catch (error) {
      logger.error('[VirtualClassroomService] : Error while validating the student present in classroom');
      throw new Error('Error while finding student in classroom');
    }
  }
}
