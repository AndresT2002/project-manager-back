import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from 'src/models/dtos/project/create-project-request.dto';
import { UpdateProjectDto } from 'src/models/dtos/project/update-project-request.dto';
import { GetProjectsQueryDto } from 'src/models/dtos/project/get-projects-query.dto';
import { AuthenticatedUser, GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/models/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  findAll(@Query() query: GetProjectsQueryDto) {
    return this.projectService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el conteo de proyectos por status' })
  @ApiResponse({ status: 200, description: 'Conteo de proyectos por status' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @Get('status-counts')
  @HttpCode(HttpStatus.OK)
  getProjectStatusCounts(@GetUser() user: AuthenticatedUser) {
    return this.projectService.getProjectStatusCounts(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
